---
title: "Tai-e PA3：从数据流分析到死代码检测"
description: "组合常量传播与活跃变量分析，通过可行边搜索识别不可达代码，并用活跃性与副作用约束判断无用赋值。"
date: 2026-11-09
kind: 学习笔记
tags: [软件分析, Tai-e, 死代码检测, 控制流图, 数据流分析, 编译优化, Java]
series: software-analysis
order: 3
related: [tai-e-pa1-live-variable-analysis, tai-e-pa2-constant-propagation-worklist]
draft: false
featured: false
---

[PA1：活跃变量分析](/articles/tai-e-pa1-live-variable-analysis/) 回答变量当前的值将来是否可能被读取；[PA2：常量传播](/articles/tai-e-pa2-constant-propagation-worklist/) 回答变量在某个程序位置能否被确定为常量。到了 [PA3](https://tai-e.pascal-lab.net/pa3.html)，问题变为：**能否组合这些分析结果，找出不需要保留的语句？**

本次实现的是死代码检测（Dead Code Detection），而非实际修改程序的死代码删除（Dead Code Elimination）。算法输出一个语句集合，不负责重写 IR 或 CFG。

## 1. 死代码并不只有一种

本次讨论两类死代码：

**不可达代码（Unreachable Code）**：从程序入口出发，在实际可行的控制流中永远无法到达的语句。它又包含普通控制流不可达，以及由常量条件造成的分支不可达。

~~~java
int x = 2;
if (x > 0) {
    return x;
} else {
    return -1; // 条件恒真，假分支不可达
}
~~~

**无用赋值（Dead Assignment）**：语句可以执行，但写入局部变量的值之后不会被读取；同时，计算右侧表达式也没有需要保留的副作用。

~~~java
int y = x + 1; // 如果 y 之后未被读取，属于候选无用赋值
return x;
~~~

两者的判断条件不同：不可达代码关心**执行路径**；无用赋值关心**数据依赖及执行效果**。即使一条语句可能抛出异常，只要它确实不可达，也不会执行；相反，一条可达的除法赋值，即使左值不活跃，也不一定可以删去。

## 2. 整体架构：消费已有分析结果

Tai-e 在执行 `DeadCodeDetection.analyze(IR)` 前，已经准备好相关分析结果。该方法读取：

~~~java
CFG<Stmt> cfg = ir.getResult(CFGBuilder.ID);

DataflowResult<Stmt, CPFact> constants =
        ir.getResult(ConstantPropagation.ID);

DataflowResult<Stmt, SetFact<Var>> liveVars =
        ir.getResult(LiveVariableAnalysis.ID);
~~~

三份信息分别提供：

| 输入 | 回答的问题 | 在 PA3 中的用途 |
| --- | --- | --- |
| CFG | 哪些语句通过什么类型的边连接？ | 搜索可达路径 |
| 常量传播的 `IN` | 到达分支前，条件是否可确定？ | 过滤不可能通过的边 |
| 活跃变量分析的 `OUT` | 赋值后的变量值将来是否会被读取？ | 识别无用赋值 |

由此，A3 的核心可以写成：

$$
DeadCode=(Stmts\setminus Reachable)\cup DeadAssignments.
$$

`Reachable` 先通过可行控制流搜索获得，之后在可达语句中检查无用赋值。最终的 `deadCode` 使用按 `Stmt::getIndex` 排序的 `TreeSet`，保证结果按语句序号输出。

### 依赖分析为何还需要后向 Worklist？

PA2 已经实现了前向 Worklist，而活跃变量分析是后向的。如果沿用同一求解器，需要补全其反向模式：

$$
OUT[n]=\bigcup_{s\in Succ(n)}IN[s],
\qquad
IN[n]=F_n(OUT[n]).
$$

初始化的边界位于 `IN[EXIT]`；每次合并后继的 IN 到当前 OUT，再调用统一接口 `transferNode(node,in,out)`。若当前 IN 变化，则重新调度**前驱**，而不是后继。

这属于准备上游结果的工作。真正的 `DeadCodeDetection` 并不再建立新的数据流方程，而是直接利用这些已计算好的 Fact。

## 3. 不可达性：在 CFG 上搜索可行边

普通图搜索会访问全部控制流后继，但 A3 能进一步使用常量传播结果剪掉已经确定不可能走通的分支。

从 Entry 出发，维护两个集合：

- `reachable`：已经确认可达且处理过的节点；
- `workList`：等待探索的节点。

本次使用两个 `LinkedHashSet`：它们保持插入顺序、自动去重。一个节点从待处理集合中取出后，若首次进入 `reachable`，就枚举它的出边；只有可行边的目标才加入待处理集合。

~~~text
reachable = {}
workList = { ENTRY }

while workList 非空:
    n = 从 workList 取出节点
    if n 已在 reachable:
        continue
    将 n 加入 reachable

    for edge in OutEdges(n):
        if Feasible(edge, n, constants):
            将 edge.target 加入 workList

Unreachable = 所有 IR 语句 - reachable
~~~

这里必须使用 `cfg.getOutEdgesOf(n)`，而不是只用 `getSuccsOf(n)`：**过滤逻辑需要边的种类和 case 值**。

这一轮图搜索与 A2 的 Worklist 不同。A2 要不断重算 IN/OUT，直到它们达到不动点；这里仅判断某个节点是否存在一条被保留的路径可达，因此每个节点扩展一次即可。

## 4. If：用常量信息剪枝

Tai-e 的 `If` 提供条件表达式，CFG 则提供 `IF_TRUE` 和 `IF_FALSE` 两类出边。

判断条件应使用语句执行**之前**的状态：

~~~java
Value cond = ConstantPropagation.evaluate(
        ifStmt.getCondition(),
        constants.getInFact(stmt)
);
~~~

若 `cond` 是常量，则 `0` 表示假，非零表示真；若不是常量，则保守地保留两条分支。

| 条件抽象值 | IF_TRUE | IF_FALSE |
| --- | --- | --- |
| Constant(1) | 保留 | 剪掉 |
| Constant(0) | 剪掉 | 保留 |
| NAC / UNDEF | 保留 | 保留 |

这里的判断只控制**当前边是否可以扩展**，并不是直接把某个源代码块整体标记为死代码。若目标还有其他可行前驱，它依然可能到达。

同时，Tai-e 会把 Java 的 `while`、`for` 等循环条件转换成 IR 中的 `If` 与跳转，所以同一套可行边规则也适用于循环。CFG 搜索本身通过 `reachable` 去重处理环，不会无限访问。

## 5. Switch：区分直接匹配与 fall-through

Switch 的剪枝比 If 多一层语义：除了 `SWITCH_CASE`，还存在 `SWITCH_DEFAULT` 边。

假设 `switch(x)` 前已经知道：

$$
IN[switch][x]=Constant(2).
$$

那么从 Switch 节点直接选出的边应满足：

$$
Feasible(SWITCH\_CASE(c))\iff c=2.
$$

Default 的条件则是“没有任何 case 与 2 相匹配”：

$$
Feasible(SWITCH\_DEFAULT)
\iff \nexists c\in Cases:\ c=2.
$$

本次实现直接检查 Switch 节点的出边，无须依赖额外的 case 列表 API：

~~~text
对于 SWITCH_DEFAULT 边:
    feasible = true
    遍历 switch 节点的所有出边:
        如果存在 SWITCH_CASE 且 caseValue == x:
            feasible = false
            结束检查
~~~

若选择变量为 NAC 或 UNDEF，不能确定匹配情况，则保留全部直接出口。

尤其要区分**直接进入某个 case**和**从上一条 case 顺序落入（fall-through）**：

~~~java
switch (x) {
    case 1: a = 10; break;
    case 2: a = 20;
    case 3: a = 30; break;
    default: a = 0;
}
~~~

当 `x=2` 时，Switch 节点到 case 3 的直接 `SWITCH_CASE` 边被排除，但 case 3 中的赋值仍然可通过 case 2 的 `FALL_THROUGH` 边到达。

这说明不可达性不能由“case 值不匹配”直接推出，而要由**整个可行 CFG 的可达性**决定。

## 6. 无用赋值：活跃性之外还需要副作用约束

可达性搜索之后，再检查可达的赋值语句。对于：

~~~java
x = a + b;
~~~

即使 `x` 在这条语句之后不再使用，也必须考虑右侧表达式能否安全丢弃。

在本次作业范围内，候选语句需要同时满足：

$$
\begin{aligned}
DeadAssign(n)\iff {}&
Reachable(n)\\
&\land AssignStmt(n)\\
&\land LHS(n)\in Var\\
&\land LHS(n)\notin LiveOUT[n]\\
&\land NoSideEffect(RHS(n)).
\end{aligned}
$$

为什么用 `LiveOUT[n]` 而不是 `LiveIN[n]`？因为我们要判断的是**当前赋值新产生的值**是否会在后续被读取，而不是语句执行前旧值是否有用。对于 `x = x + 1`，右侧读取旧值，但新值仍可能无用。

Tai-e 提供的 `hasNoSideEffect(RValue)` 会保守地排除可能产生可观察效果或异常的表达式。例如：

| 右侧表达式 | 为什么不能仅凭左值不活跃就删除？ |
| --- | --- |
| `NewExp` | 对象分配 |
| `CastExp` | 可能触发类型转换异常 |
| `FieldAccess` | 可能触发类初始化或空指针异常 |
| `ArrayAccess` | 可能触发数组访问相关异常 |
| 除法与取余 | 可能抛出除零异常 |

值得注意的是，辅助方法对除法和取余采用的是**按运算符保守处理**，并不会额外证明除数一定非零。

另一个边界是方法调用。Tai-e 用 `Invoke` 表示调用语句，包括 `x = m()` 形式。PA3 统一认为调用可能具有副作用，因此**无用赋值检测只关注 `AssignStmt`，不把 Invoke 视为可删除的普通赋值**。不过如果一条 Invoke 本身不可达，它仍属于第一类不可达代码。

## 7. 两种分析结果的组合与精度边界

把两个阶段放在一起，整个方法的逻辑很简洁：

~~~text
1. 读取 CFG、ConstantPropagation、LiveVariableAnalysis
2. 从 Entry 沿可行边搜索 reachable
3. 对所有不在 reachable 中的 IR 语句，标记不可达
4. 对 reachable 内的 AssignStmt:
       左侧是 Var
       且左值不属于 LiveOUT
       且右侧无副作用
       => 标记无用赋值
5. 返回按语句索引排序的 deadCode
~~~

这里有两个精度限制。

**首先，可行边判断依赖已有的常量传播结果。** A2 是路径不敏感分析，可能因为合并了实际上不会执行的路径而得到 NAC，导致 A3 无法剪掉某些真实不可达分支。这是保守性带来的精度损失，不一定是实现错误。

**其次，本次只检测一轮。** 例如：

~~~java
a = 1;
b = a + 2;
return 0;
~~~

活跃变量分析会因为第二条语句读取 `a`，而认为第一条赋值的结果有用；与此同时，第二条对 `b` 的赋值可能是无用的。若真的删除第二条语句，第一条会进一步成为死代码，但 PA3 **不要求重新运行分析、反复删除直到稳定**。

换句话说，A3 是一个静态检测过程，并不是完整的迭代优化流水线。

## 8. 从三次作业看分析系统的分层

| | PA1 | PA2 | PA3 |
| --- | --- | --- | --- |
| 核心问题 | 当前值未来是否可能使用 | 当前值是否为确定常量 | 哪些语句不需要保留 |
| 分析方向 | 后向 | 前向 | 组合前向与后向结果 |
| 核心数据 | `SetFact<Var>` | `CPFact` | 可达节点与死代码集合 |
| 核心机制 | USE/DEF + 不动点 | 抽象求值 + Worklist | 可行边搜索 + 副作用检查 |
| 输出 | 活跃变量 IN/OUT | 常量 IN/OUT | `Set<Stmt>` |

从 A1 到 A2，重点是**如何定义与求解数据流分析**；从 A2 到 A3，重点转向**如何组合分析结果服务于具体的程序变换需求**。

这也是静态分析框架的价值所在：CFG 是共享的程序结构，分析器产生可复用的语义事实，而上层检测或优化阶段根据这些事实作出进一步判断。A3 无须重新推导活跃变量或常量传播，只需在它们的结果上建立一套明确的可达性与安全性规则。

本次实现已通过本地 Gradle 测试；在线隐藏测试结果尚未在本文记录。

---

**参考资料：** [Tai-e PA3 作业说明](https://tai-e.pascal-lab.net/pa3.html) · [Tai-e Assignments](https://github.com/pascal-lab/Tai-e-assignments) · [PA1：活跃变量分析](/articles/tai-e-pa1-live-variable-analysis/) · [PA2：常量传播](/articles/tai-e-pa2-constant-propagation-worklist/)
