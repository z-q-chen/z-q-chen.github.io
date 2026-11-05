---
title: "Tai-e PA2：常量传播、抽象值格与 Worklist 求解器"
description: "从抽象域与前向数据流方程出发，理解 Meet、Transfer、表达式求值和 Worklist 不动点求解。"
date: 2026-11-05T16:00:00+08:00
kind: 学习笔记
tags: [软件分析, Tai-e, 常量传播, 数据流分析, 抽象解释, Java]
series: software-analysis
order: 2
related: [tai-e-pa1-live-variable-analysis]
draft: false
featured: false
---

[PA1：活跃变量分析](/articles/tai-e-pa1-live-variable-analysis/) 以变量集合为数据流事实，采用全图迭代求解。PA2 则引入**常量传播（Constant Propagation）**与 **Worklist Solver**：前者重新定义程序状态的抽象方式，后者改进数据流方程的求解策略。

两者分别回答不同的问题：**如何描述需要分析的程序性质，以及如何沿控制流高效传播这些性质。**

## 1. 从变量集合到常量信息

考虑：

~~~java
int x = 3;
int y = x + 2;
int z = y * 4;
~~~

我们可以依次确定 \`x=3\`、\`y=5\`、\`z=20\`。但在分支程序中：

~~~java
if (flag) {
    x = 3;
} else {
    x = 4;
}
int y = x + 2;
~~~

汇合点处的 \`x\` 不能再由唯一常量表示。常量传播要回答的是：**某个程序位置上的变量，是否能被证明在所有考虑的路径上取同一个常量值？**

PA2 是过程内、路径不敏感的常量传播，处理 \`int\` 及 \`boolean\`、\`byte\`、\`short\`、\`char\` 等 int-like 类型；不处理 \`long\`、\`float\`、\`double\` 和引用值。

## 2. 抽象值格：UNDEF、Constant、NAC

具体程序状态的可能取值非常多，但“能否确定唯一常量”只需要三类抽象值：

$$
L=\{UNDEF\}\cup\{Constant(c)\mid c\in\mathbb Z_{32}\}\cup\{NAC\}.
$$

- \`UNDEF\`：尚未获得有效常量信息，作为分析初始状态的底元素；
- \`Constant(c)\`：可以确定变量的值是 \`c\`；
- \`NAC\`（Not A Constant）：无法确定一个唯一的常量值。

按照信息逐渐增长的偏序：

$$
UNDEF\sqsubseteq Constant(c)\sqsubseteq NAC.
$$

不同常量互不可比。合并两个路径上的值时：

$$
\begin{aligned}
UNDEF\sqcup v &= v,\\
Constant(a)\sqcup Constant(a)&=Constant(a),\\
Constant(a)\sqcup Constant(b)&=NAC\quad(a\ne b),\\
NAC\sqcup v&=NAC.
\end{aligned}
$$

这里的 \(\sqcup\) 是在上述偏序下的合并；课程把这个操作称作 **Meet**，对应的是相反方向的偏序约定。具体的运算规则并没有分歧。

PA2 使用 \`CPFact\` 保存变量到抽象值的映射：

$$
CPFact:Var\longrightarrow L.
$$

它继承自 \`MapFact<Var,Value>\`。实现中的一个关键约定是：**变量没有出现在 Map 中，就表示其抽象值为 UNDEF**。因此空的 \`CPFact\` 已经能够表示所有变量尚无信息；更新为 UNDEF 则会删除对应映射。

## 3. 前向数据流方程与初始化

PA2 是前向分析。对于 CFG 节点 \(n\)：

$$
IN[n]=\bigsqcup_{p\in Pred(n)}OUT[p],
\qquad
OUT[n]=F_n(IN[n]).
$$

其中，第一条方程合并前驱的信息，第二条描述当前语句的效果。

方法入口处，无法知道调用者传入的形参具体值，所以可分析的参数初始化为 \`NAC\`。其他变量以 \`UNDEF\` 开始。边界条件是：

$$
OUT[ENTRY]=BoundaryFact.
$$

之所以设置 Entry 的 OUT，是因为前向分析的后继节点需要读取前驱的 OUT。普通节点的 IN 和 OUT 分别初始化为独立的 Fact 对象，以避免可变对象的别名影响。

## 4. Meet 与 Transfer 的分工

Meet 用于**路径汇合**。若两条路径分别得到 \`x=3\` 与 \`x=4\`，则：

$$
merge(3,4)=NAC.
$$

\`meetInto(fact,target)\` 对来源 Fact 的每个映射调用 \`meetValue()\`，并原地更新目标 Fact。目标中独有的变量不必处理，因为它们在来源中对应 UNDEF，满足 \(v\sqcup UNDEF=v\)。

Transfer 则用于**模拟一条语句执行后的状态**。对 \`x = rhs\`：

$$
OUT[n]=IN[n][x\mapsto Eval(rhs,IN[n])].
$$

其中右侧必须从 IN 求值，以处理 \`x = x + 1\` 这种读取旧值的语句。赋值采用覆盖语义，而不是路径合并：

~~~java
x = 3;
x = 4;  // OUT[x] = Constant(4)，不是 NAC
~~~

对于方法调用、字段读取等超出本次精确求值范围的表达式，若其赋值目标是 int-like 变量，则保守更新为 \`NAC\`。其他不定义此类变量的语句，Transfer 保持输入状态不变。

## 5. 表达式的抽象求值

\`evaluate(exp,in)\` 根据表达式类型求抽象值：

| 表达式 | 抽象求值 |
| --- | --- |
| \`IntLiteral\` | \`Constant(c)\` |
| \`Var\` | \`in.get(var)\` |
| \`BinaryExp\` | 根据操作数的抽象值及运算符求值 |
| 其他表达式 | 保守返回 NAC |

Tai-e 的 \`BinaryExp\` 两个操作数都是 \`Var\`。例如 \`x = y + 6\` 会被拆成常量临时变量赋值和一次二元运算，因此只需从当前 IN 读取两个操作数。

二元运算覆盖算术（\`+ - * / %\`）、比较（\`== != < > <= >=\`）、移位（\`<< >> >>>\`）和位运算（\`| & ^\`）。比较结果用整数 \`0\` 和 \`1\` 表示。

普通表达式遵循保守的抽象传播规则：若任意操作数为 NAC，结果为 NAC；否则若出现 UNDEF，结果为 UNDEF；两个操作数都是常量时，才执行具体的整数运算。

**除零是 PA2 单独指定的特殊语义**：对于 \`/\` 和 \`%\`，只要已知除数为零，就返回 UNDEF，包括 \`NAC / 0\` 和 \`NAC % 0\`。因此已知零除数的判断应在一般 NAC 检查之前；随后仍须检查 NAC、UNDEF，才能安全调用 \`getConstant()\`。

这种抽象求值并非完全精确。例如按基础规则，\`NAC * 0\` 仍会得到 NAC，尽管具体的整数乘法结果总是零。分析精度不仅受抽象域影响，也受抽象运算规则影响。

## 6. Worklist：按需传播变化

PA1 的 Iterative Solver 每轮扫描整个 CFG。PA2 的 Worklist Solver 则利用数据依赖：**一个节点的 OUT 发生变化，才有必要重新处理它的后继**。

~~~text
初始化 worklist，加入全部非 Entry 节点

while worklist 非空:
    n = 取出待处理节点
    for p in Pred(n):
        meetInto(OUT[p], IN[n])
    changed = transferNode(n, IN[n], OUT[n])
    if changed:
        将 Succ(n) 中的非 Entry 节点加入 worklist
~~~

本次实现采用 \`LinkedHashSet\`：它保留插入顺序、自动去重，增删查找通常具有平均 \(O(1)\) 的时间复杂度。取出节点后立即从集合中删除，使它在后续信息变化时仍能重新入队。

初始化时加入所有非 Entry 节点，是为了保证节点获得至少一次处理机会。若只从入口后继开始，而一个中间节点首次计算后的 OUT 恰好没有变化，后续节点可能不会被访问。

Worklist 和全图迭代求解的是同一组方程。调度方式主要影响重复计算量，而不应该改变稳定后的分析结果。

## 7. 不动点、终止性与理论边界

CFG 中的循环带来环形依赖，因此单次传播一般不够。求解器不断更新状态，直到满足全部数据流方程，即达到不动点。

标准单调常量传播框架中的状态沿偏序增长：

$$
UNDEF\longrightarrow Constant(c)\longrightarrow NAC.
$$

单个变量在单个程序位置的严格增长次数有限；如果所有传递函数单调，并采用公平调度，就可以由有限高度的状态空间论证迭代终止。

但 PA2 的除零规则还有一个值得记录的数学细节：

$$
Eval(NAC/UNDEF)=NAC,\qquad Eval(NAC/0)=UNDEF.
$$

分母从 UNDEF 增长为 Constant(0) 时，表达式结果却可能从 NAC 回到 UNDEF。因此这条特殊规则**并非在上述偏序下对所有输入都单调**；不能不经检查就把标准单调框架的收敛定理套用于整套作业语义。这也说明抽象求值的特殊处理并非仅是编程边界情况，而是与分析理论直接相关。

## 8. 从 PA1 到 PA2 的结构性收获

| 维度 | PA1 | PA2 |
| --- | --- | --- |
| 分析目标 | 活跃变量 | 常量传播 |
| 分析方向 | 后向 | 前向 |
| Fact | 变量集合 | 变量到抽象值的映射 |
| Meet | 集合并集 | 逐变量格合并 |
| Transfer | USE/DEF | 赋值覆盖与表达式求值 |
| Solver | 全图 Iterative | 增量 Worklist |

两次作业遵循相同的框架：

$$
\boxed{\text{抽象域}+\text{边界条件}+\text{Meet/Transfer}+\text{不动点求解}}
$$

\`DataflowAnalysis\` 负责定义语义，\`Solver\` 负责调度计算，\`DataflowResult\` 保存各程序位置的 IN/OUT。算法的可扩展性来自这种职责分离：换一种程序性质，并不意味着必须重写控制流图和求解器。

本次实现已通过本地及在线评测。PA2 最核心的收获，是从“变量集合的传播”迈向“抽象状态上的程序语义求值”，并以 Worklist 将变化局部地传播到可能受影响的节点。

---

**参考资料：** [Tai-e PA2 作业说明](https://tai-e.pascal-lab.net/pa2.html) · [Tai-e Assignments](https://github.com/pascal-lab/Tai-e-assignments) · [上一篇：PA1 活跃变量分析](/articles/tai-e-pa1-live-variable-analysis/)
