---
title: "Tai-e PA1：从活跃变量分析到迭代求解器"
description: "从 USE/DEF、May/Must 与不动点出发，沿真实调用链理解 Tai-e 的数据流分析框架与实现中的 Java 陷阱。"
date: 2026-10-10T17:30:00+08:00
kind: 学习笔记
tags: [软件分析, Tai-e, 数据流分析, 编译原理, Java]
series: software-analysis
order: 1
draft: false
featured: false
---

这是「软件分析 · Tai-e」系列的第一篇，记录我学习南京大学软件分析课程 [PA1](https://tai-e.pascal-lab.net/pa1.html) 的过程。这次作业是 Live Variable Analysis 与 Iterative Solver。六个 TODO 本身并不长，但我更关心三个问题：**为什么数据流方程是这样、为什么求解器能终止，以及 Tai-e 如何将分析规则与求解过程分离。**

这篇是原理和源码设计的学习复盘，保留关键片段，不贴整份可以直接提交的作业答案。

## 1. 活跃的到底是变量，还是它当前的值？

活跃（Live）不是“变量存在”或“变量已赋值”，而是：**当前保存的值有可能在未来被读取，并且在读取之前不会先被覆盖。**

考虑：

~~~java
x = 1;
y = x + 2;
x = 3;
print(y);
~~~

第二句之后，旧的 `x` 之后只会被覆盖，不会再被读取；而 `y` 会用于打印。因此此位置的活跃变量集合是 $\{y\}$。如果第三句改为 `x = x + 3`，那么旧 `x` 又被读取，也会成为活跃变量。

对于 CFG 中任一节点 $n$，定义：

- $IN[n]$：语句执行前的活跃变量。
- $OUT[n]$：语句执行后的活跃变量。
- $USE[n]$：语句本身读取的变量。
- $DEF[n]$：语句本身覆盖或定义的变量。

于是：

$$
IN[n]=USE[n]\cup(OUT[n]-DEF[n]).
$$

先从 OUT 中去掉本语句定义的变量，是因为其旧值被覆盖；再加入 USE，是因为本语句要读取它们。对于 `x = x + 1`，$x$ 同时在 USE 和 DEF 中，最终仍属于 IN。

## 2. 为什么是 Backward + May + Union

当前值有没有用，取决于后续执行，所以这是**后向分析**：

$$
OUT[n]=\bigcup_{s\in Succ(n)}IN[s].
$$

在条件分支中，只要存在一条可能的后续路径会读取旧值，它就必须被视作活跃。因此分析是 **May Analysis**，分支的合并操作是**并集**。

作为对比，确定赋值（Definite Assignment）分析要知道“执行到此处时，变量是否在每条路径上都已赋值”，属于典型的前向 Must Analysis，常用：

$$
IN[n]=\bigcap_{p\in Pred(n)}OUT[p],
\qquad OUT[n]=IN[n]\cup DEF[n].
$$

这里需要区分两个独立维度：**Backward / Forward 是传播方向；May / Must 是对不同执行路径的量词语义**。

## 3. 为什么反复迭代？为什么从空集开始？

直线执行的程序，可以从后往前传播信息；但控制流可能形成循环，节点之间存在环形依赖，一次遍历不一定计算完整。

在活跃变量分析使用的变量集合格中，集合包含关系是偏序，$\varnothing$ 是底元素，合并操作为并集。普通节点从空集初始化，反复应用单调传递函数，集合逐步增加。变量全集有限，因而这种迭代最终会稳定，得到**最小不动点**：

$$
\varnothing\subseteq F(\varnothing)\subseteq F^2(\varnothing)\subseteq\cdots
$$

为什么强调“最小”？在存在循环的方程中可能有不止一个不动点。若一个变量从未被读取，不应仅因循环相互传递一个假设就把它标记为活跃。

经典位向量分析中，以集合包含为偏序时有一个实用规律：并集合并、求最小不动点，通常从空集开始；交集合并、求最大不动点，通常从全集开始。**边界条件需要单独指定**，并且这不是任意抽象域都适用的口诀。

活跃变量分析是后向的，出口边界为：

$$
IN[EXIT]=\varnothing.
$$

## 4. Tai-e 的整体架构与真实调用链

我先按执行顺序理解框架，再实现 TODO。

~~~text
new LiveVariableAnalysis(config)
  └─ AbstractDataflowAnalysis(...)
       └─ Solver.makeSolver(this)
            └─ new IterativeSolver<>(analysis)

analyze(IR)
  └─ 从 IR 获取 CFG
       └─ solver.solve(cfg)
            ├─ initialize(cfg)
            │    └─ initializeBackward(...)
            │         ├─ newBoundaryFact(...)
            │         └─ newInitialFact()
            ├─ doSolve(cfg, result)
            │    └─ doSolveBackward(...)
            │         ├─ meetInto(...)
            │         └─ transferNode(...)
            └─ return DataflowResult
~~~

`Solver.solve()` 的结构可以概括为“**初始化 → 求解 → 返回结果**”。`isForward()` 决定走前向还是后向分支，活跃变量返回 `false`，因此进入 `initializeBackward()` 与 `doSolveBackward()`。

主要模块的分工：

| 类或接口 | 职责 |
| --- | --- |
| `CFG<Node>` | 保存控制流图及各节点的前驱、后继 |
| `DataflowAnalysis<Node, Fact>` | 定义方向、边界、初值、Meet 和 Transfer |
| `LiveVariableAnalysis` | 活跃变量的具体分析规则 |
| `Solver` / `IterativeSolver` | 初始化和不动点迭代 |
| `SetFact<Var>` | 一份可变的变量集合 |
| `DataflowResult<Node, Fact>` | 保存整张图每个节点的 IN 和 OUT |

在这里，泛型 `Node` 实际是 `Stmt`，`Fact` 是 `SetFact<Var>`。Solver 本身不认识 USE 和 DEF，只通过 Analysis 接口驱动计算；Tai-e 已经提供 IR 和 CFG，不需要我们手动解析 Java 控制流。

## 5. 初始化：Fact 是可变对象

在 `initializeBackward()` 中，出口节点使用 `newBoundaryFact(cfg)` 设置 IN，其他节点分别调用 `newInitialFact()` 初始化 IN 与 OUT。

PA1 这两个工厂方法都创建空集合，但语义不同：一个是固定的边界事实，一个是迭代的初始估计。

需要特别留意 Java 对象引用。`DataflowResult` 保存 Fact 对象，`getInFact(node)` 取回的也是它的引用。`in = newIn` 只改变局部变量；`in.set(newIn)` 才会改变原集合的内容。IN 和 OUT 不能错误地指向同一个可变 `SetFact`。

## 6. 求解：Meet → Transfer → Changed

后向迭代求解可以压缩为以下伪代码：

~~~text
repeat:
    changed = false
    for each non-exit node n:
        for each successor s:
            meetInto(IN[s], OUT[n])
        changed |= transferNode(n, IN[n], OUT[n])
until changed == false
~~~

外层循环负责收敛，节点循环扫描 CFG，后继循环合并信息。**只有所有后继的 Meet 完成后，才应该对当前节点运行一次 Transfer**。

### Meet：将后继 IN 并入当前 OUT

$$
OUT[n]=\bigcup_{s\in Succ(n)}IN[s].
$$

`meetInto(fact, target)` 是原地修改 `target`，因此可以用 `target.union(fact)` 表达。源和目标不能写反，否则可能污染后继的 IN。

对当前活跃变量分析而言，IN 与 OUT 从空集单调增长，并集满足 $A\cup A=A$，所以可以不断并入原 OUT，而不是每轮都清空重算。这种实现依赖分析的性质，不能不加判断地用于其他分析。

### Transfer：在 OUT 的基础上计算 IN

`Stmt.getDef()` 返回 `Optional<LValue>`，`Stmt.getUses()` 返回 `List<RValue>`；只有其中的 `Var` 属于我们处理的变量集合。

步骤是：

~~~text
newIn = OUT 的副本
如果 getDef() 存在且为 Var，从 newIn 删除它
遍历 getUses()，将其中的 Var 加入 newIn
比较 newIn 和旧 IN
若不相等，则将 newIn 内容写入旧 IN 并返回 true
否则返回 false
~~~

`out.copy()` 的用途是保护 OUT，而不是数学公式要求必须复制。若直接写 `newIn = out`，之后删除 DEF 就会意外修改 OUT；若先覆盖旧 IN，又不便比较新旧状态。

### Changed：一个容易被忽略的 Java 陷阱

我一度写成：

~~~java
flag = flag || analysis.transferNode(node, in, out);
~~~

问题是 Java 的 `||` 会短路：一旦 `flag` 为 `true`，后续节点的 `transferNode()` 就不会执行。更适合这里的写法是：

~~~java
if (analysis.transferNode(node, in, out)) {
    flag = true;
}
~~~

或者使用非短路的布尔复合运算：

~~~java
flag |= analysis.transferNode(node, in, out);
~~~

这保证了每个节点都会执行 Transfer，并记录**本轮是否有任一节点发生变化**。只要 IN 变化，它就可能继续影响前驱节点的 OUT；当整轮所有 IN 均不再变化时，算法收敛。

## 7. 用四条语句检验整个方程

~~~java
d = a + b;  // S1
b = d;      // S2
c = a;      // S3
return b;   // S4
~~~

正确的活跃集合：

| 节点 | IN | OUT |
| --- | --- | --- |
| S1 | {a, b} | {a, d} |
| S2 | {a, d} | {a, b} |
| S3 | {a, b} | {b} |
| S4 | {b} | ∅ |

例如 S2：从 S3 取得 OUT = {a, b}；当前定义了 b，读取 d，所以 IN = {a, d}。

后向分析通常优先从靠近出口的节点处理，能减少迭代次数。但**分析方向和遍历顺序不是同一概念**，遍历顺序影响效率，稳定后的结果由数据流方程决定。

## 8. 本次实现最值得记住的坑

| 细节 | 可能的错误 |
| --- | --- |
| `x = x + 1` | 先加 USE 再删除 DEF，会把需要读取的 x 错删 |
| `Optional<LValue>` | 不能假定每条语句一定有 DEF |
| `List<RValue>` | 不能把所有右值直接转成 Var |
| `newIn = out` | 复制的是引用，而不是集合 |
| `in = newIn` | 不会更新 DataflowResult 中已有 Fact 的内容 |
| `meetInto(fact, target)` | 颠倒参数会修改错误的对象 |
| Transfer 在后继循环内部 | 一个节点被传递多次，无后继节点可能漏算 |
| `flag = flag || transferNode(...)` | 短路求值跳过真正需要执行的方法 |

## 9. 测试与复盘

完成六个方法后，我运行了：

~~~bash
./gradlew test
./gradlew test --rerun-tasks
~~~

最初输出 `4 up-to-date`，表示 Gradle 复用了任务结果；之后通过强制重新执行完成本地测试。测试通过说明本地测试集没有报错，不代表自动保证所有隐藏测试都通过。

这次 PA1 的收获不只是学会套公式，而是建立了一条完整的思考路径：

$$
\boxed{
\text{程序性质}
\to\text{数据流方程}
\to\text{边界与初值}
\to\text{Meet/Transfer}
\to\text{不动点求解}
}
$$

从架构上看，**Analysis 定义规则，Solver 执行求解，DataflowResult 保存状态**。下一步自然会想到：既然只有变化的 IN 才可能影响前驱，为什么还要每轮遍历整个 CFG？这就是 Worklist Solver 的动机。

---

**参考资料：** [Tai-e PA1 作业说明](https://tai-e.pascal-lab.net/pa1.html) · [Tai-e Assignments](https://github.com/pascal-lab/Tai-e-assignments) · [Tai-e 项目主页](https://tai-e.pascal-lab.net/)
