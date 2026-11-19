---
title: "Tai-e PA4：从调用图到过程间常量传播"
description: "从类层次结构分析构建调用图，在 ICFG 上引入边传递函数，将过程内常量传播扩展为过程间不动点分析。"
date: 2026-11-19
kind: 学习笔记
tags: [软件分析, Tai-e, 调用图, 类层次结构分析, 过程间分析, 常量传播, Java]
series: software-analysis
order: 4
related: [tai-e-pa2-constant-propagation-worklist, tai-e-pa3-dead-code-detection]
draft: false
featured: false
---

[PA2：常量传播](/articles/tai-e-pa2-constant-propagation-worklist/) 已经能够沿控制流追踪局部变量的抽象值，但分析范围被限制在单个方法内部。一旦遇到方法调用，分析器通常只能保守地处理返回值。

例如：

~~~java
static int addOne(int x) {
    return x + 1;
}

int a = 6;
int b = addOne(a);
int c = b - 3;
~~~

从程序语义上看，`b=7`、`c=4` 都是确定的。但过程内常量传播无法直接利用 `addOne` 的实现，因为调用者和被调用者属于不同的控制流图。

[PA4](https://tai-e.pascal-lab.net/pa4.html) 的目标是跨越这条边界。它并不改变 PA2 的常量抽象域，而是补充了两种能力：**确定方法可能调用谁，以及让数据流事实在不同方法之间传播。**

整体分析可以概括为：

~~~text
Java 程序 + 类层次结构
             │
             ▼
      CHA 调用图构建
             │
             ▼
        Call Graph
             │
             ▼
         ICFG 构建
             │
             ▼
       过程间常量传播
             │
             ▼
     各程序位置的 IN/OUT
~~~

这一次的重点不再是设计新的抽象值，而是把调用关系、控制流结构与既有数据流分析连接起来。

## 1. 方法调用为什么需要单独分析？

普通赋值语句的语义较为直接：

~~~java
x = y + 1;
~~~

只需要读取当前状态中 `y` 的抽象值，就可以计算新的 `x`。但方法调用包含两个不同的问题：

1. 这条调用语句可能执行哪些方法？
2. 实参如何进入被调用方法，返回值又如何回到调用者？

第二个问题依赖第一个问题。在 Java 中，方法调用不总是静态确定的：

~~~java
class A {
    int f() { return 1; }
}

class B extends A {
    @Override
    int f() { return 2; }
}

A obj = ...;
int x = obj.f();
~~~

调用点写的是 `obj.f()`，但实际执行 `A.f()` 还是 `B.f()`，取决于运行时对象类型。

静态分析不能仅根据变量声明类型选择一个方法，也不能在缺乏证据时假定某个具体实现一定被调用。因此，首先需要构建调用图。

## 2. CHA：从类层次结构构建调用图

**类层次结构分析（Class Hierarchy Analysis, CHA）** 利用类与接口之间的继承、实现关系，保守地估计虚调用可能到达的方法。它不依赖实际执行程序，也不需要先分析对象分配与指针指向关系。

### 2.1 Dispatch：给定接收者类型，查找方法实现

设方法子签名为：

$$
s = \texttt{int f()}.
$$

对于某个类 $C$，定义：

$$
Dispatch(C,s)
$$

表示从 $C$ 出发，按照类继承链寻找可执行的方法实现。搜索首先检查当前类是否声明了与 $s$ 匹配的具体方法；若没有，则沿父类继续向上查找。

例如：

~~~java
class A {
    int f() { return 1; }
}

class B extends A {}

class C extends B {
    @Override
    int f() { return 3; }
}
~~~

则：

$$
\begin{aligned}
Dispatch(B,f)&=A.f,\\
Dispatch(C,f)&=C.f.
\end{aligned}
$$

`B` 没有重写 `f`，因此继承 `A` 的实现；`C` 则使用自己的实现。

这说明 **Dispatch 处理的是方法继承与重写，不是枚举所有可能的运行时类型**。后者属于 Resolve 的职责。

### 2.2 Resolve：不同调用类型具有不同语义

PA4 处理四种 Java 调用类型：

| 调用类型 | 含义 | 本次分析策略 |
| --- | --- | --- |
| `STATIC` | 静态方法调用 | 根据符号声明类型解析 |
| `SPECIAL` | 构造器、特殊调用等 | 根据指定类型解析 |
| `VIRTUAL` | 普通实例方法调用 | 考虑类及其子类 |
| `INTERFACE` | 接口方法调用 | 考虑实现类及相关类型 |

对 `STATIC` 和 `SPECIAL`，本次作业不需要枚举可能的动态接收者类型。对 `VIRTUAL` 和 `INTERFACE`，则需要遍历相关类型层次，对每个候选类执行 Dispatch，并将得到的具体方法加入目标集合。

形式上，对于虚调用点 $c$，可以把 CHA 的目标集合概括为：

$$
Targets_{\mathrm{CHA}}(c)
=
\bigcup_{T\in Subtypes(D_c)}
\{Dispatch(T,s_c)\},
$$

其中 $D_c$ 是调用点方法引用中的声明类型，$s_c$ 是目标方法的子签名，$Subtypes(D_c)$ 表示相关的类及其子类型；不存在的目标不计入集合。

对接口调用，还要沿接口继承关系找到实现类，再继续考虑其子类。

实现中使用 `ClassHierarchy` 查询直接子类、子接口和直接实现类，通过 Worklist 展开类型层次，使用 `visited` 防止重复遍历。

这里 `workList` 和 `visited` 的职责不同：前者保存待处理类型，后者记录已经展开的类型。即使 Worklist 自动去重，元素出队后仍可能再次被加入，所以不能用 Worklist 替代 `visited`。

### 2.3 BuildCallGraph：从入口方法递归发现可达方法

有了 Resolve，还不能直接得到完整调用图，因为并非程序中定义的所有方法都从入口可达。构图从入口方法开始：

~~~text
workList = {入口方法}
callGraph = 空图

while workList 非空:
    m = 取出一个方法

    如果 m 已处理:
        continue

    标记 m 为可达

    for m 中每个调用点 c:
        targets = Resolve(c)

        for targets 中每个方法 t:
            添加调用边 c → t

            如果 t 尚未处理:
                将 t 加入 workList
~~~

调用图中的边并不是简单的“类到类”或“方法到方法”的无类型连接，而是携带调用类型、具体调用点和目标方法的信息。这使得后续分析能够区分同一个方法中的不同调用位置。

CHA 的特点也在此体现：**它根据类型结构保守地包含潜在目标，而不要求这些目标对应的对象一定会在运行时被创建。**

这种策略有助于避免漏掉调用目标，但也可能引入实际不会发生的调用边。

## 3. 从 Call Graph 到 ICFG

调用图回答的是“哪些方法之间可能存在调用关系”。常量传播还需要知道“程序状态如何沿调用关系移动”。

为此，Tai-e 使用 **过程间控制流图（Interprocedural Control Flow Graph, ICFG）**。

普通 CFG 只描述单个方法内部的控制流；ICFG 将多个方法的 CFG 通过调用与返回边连接起来。

对 `b = addOne(a)` 这样的调用，ICFG 中至少需要区分两类信息通路：

- **穿过被调用方法**：由 Call Edge 进入方法 Entry，执行方法体，再由 Return Edge 回到调用者；
- **留在调用者内部**：沿 Call-to-return Edge，把调用者已有的局部信息直接传给返回位置。

这两条通路承载的信息不同，因此 ICFG 不能对所有边使用完全相同的数据流规则。

## 4. Edge Transfer：过程间分析的关键扩展

PA2 的前向数据流方程为：

$$
IN[n]=\bigsqcup_{p\in Pred(n)}OUT[p],
\qquad
OUT[n]=F_n(IN[n]).
$$

而在 ICFG 中，前驱可能来自另一个方法，其局部变量具有不同的命名空间和语义。因此，必须先对边进行转换：

$$
\boxed{
IN[n]=\bigsqcup_{e=(p,n)}F_e(OUT[p])
}
$$

节点传递函数仍然是：

$$
OUT[n]=F_n(IN[n]).
$$

区别集中在新引入的 $F_e$，即 **Edge Transfer**。

### 4.1 Normal Edge：普通控制流

普通控制流不需要改变状态：

$$
F_{\mathrm{normal}}(fact)=fact.
$$

例如 `a=6` 后执行 `b=a+1`，二者处于同一方法，变量对应关系没有变化。

### 4.2 Call Edge：从实参映射到形参

对于：

~~~java
int a = 6;
int b = addOne(a);
~~~

假设被调用方法的形参为 `x`，那么调用点已有：

$$
OUT[call](a)=Constant(6).
$$

沿 Call Edge 进入 `addOne` 时，需要得到：

$$
IN[Entry(addOne)](x)=Constant(6).
$$

映射规则为：

$$
param_i\longmapsto OUT[call](arg_i).
$$

Call Edge 产生的 Fact 只包含与被调用方法形参有关的信息，而不是复制调用者的所有局部变量。否则不同方法的变量空间会被错误地混合。

### 4.3 Call-to-return Edge：保留调用者状态

考虑：

~~~java
int a = 6;
int b = addOne(a);
int c = a + b;
~~~

跨过调用后，`a=6` 这条信息应该继续保留。但调用结果 `b` 不能简单地沿用调用前的值。

因此，Call-to-return Edge 复制调用者的状态，再移除被调用结果变量的旧信息：

$$
F_{\mathrm{c2r}}(fact)=fact\setminus\{b\}.
$$

这里的移除是删除变量对应的旧映射，而不是断言它最终一定是 UNDEF。它表示：**调用者原有的信息可以继续流动，但返回值必须由真正的返回路径提供。**

尤其需要注意，Edge Transfer 不应该原地修改源节点的 OUT Fact。因为同一个 OUT 可能被多条边使用，修改它会破坏其他传播路径共享的状态。

### 4.4 Return Edge：从返回变量映射到调用结果

假设 `addOne` 的返回语句是：

~~~java
return y;
~~~

经过方法内部分析，得到：

$$
OUT[Exit](y)=Constant(7).
$$

Return Edge 将 `y` 的值映射回调用点的结果变量 `b`：

$$
b\longmapsto Constant(7).
$$

如果一个方法有多条返回语句，则返回值需要经过抽象值合并：

$$
v_{\mathrm{return}}
=
\bigsqcup_{r\in Returns(f)}Value(r).
$$

若两条返回路径分别给出 `Constant(1)` 和 `Constant(2)`，合并结果为 NAC。

本次实现利用已有 `meetValue` 规则合并返回变量，再将其映射到调用结果。

四种边的职责可以概括为：

| ICFG 边 | 数据流作用 |
| --- | --- |
| Normal | 原样传播 |
| Call-to-return | 保留调用者状态，移除旧的调用结果 |
| Call | 实参映射到形参 |
| Return | 返回变量映射到调用结果 |

而调用节点自身不需要再执行传统的“未知调用返回值设为 NAC”规则。对于 PA4 的调用节点，Node Transfer 保持输入状态不变；调用相关的信息变换由边负责。

这也是从过程内分析转向过程间分析时最重要的设计变化：**节点描述局部计算，边描述跨上下文的信息转换。**

## 5. InterSolver：将 PA2 的 Worklist 推广到 ICFG

实现过程间常量传播，并不意味着需要设计一个完全不同的不动点求解器。

PA2 已经建立了基本模式：初始化数据流事实、合并前驱信息、执行节点 Transfer，以及在输出变化时重新调度后继。

PA4 保留了这一结构，只修改两处。

### 5.1 初始化范围扩大到整个 ICFG

PA2 每次分析单个方法，而 PA4 面向整个 ICFG。因此，每个 ICFG 节点都需要独立的 IN 和 OUT Fact。

但 BoundaryFact 只能设置在 ICFG 所指定的程序入口方法上，而不能设置在每个被调用方法的 Entry 上。

在过程内分析中，形参值通常未知，可以保守地初始化为 NAC。但在过程间分析中，形参可以从 Call Edge 获得精确信息。例如：

$$
UNDEF\sqcup Constant(6)=Constant(6).
$$

如果提前把被调用方法的形参设置为 NAC，那么：

$$
NAC\sqcup Constant(6)=NAC.
$$

分析就失去了从调用者传递常量的能力。

因此，普通被调用方法入口应使用 InitialFact，等待来自 Call Edge 的信息。

### 5.2 合并前驱时先执行 Edge Transfer

求解器的核心可以概括为：

~~~text
初始化所有节点的 IN / OUT
设置程序入口的 BoundaryFact
将节点加入 Worklist

while Worklist 非空:
    n = 取出一个节点

    for n 的每条入边 e=(p,n):
        edgeFact = EdgeTransfer(e, OUT[p])
        Meet(edgeFact, IN[n])

    changed = NodeTransfer(n, IN[n], OUT[n])

    if changed:
        将 n 的后继加入 Worklist
~~~

这里必须遍历入边，而不只是前驱节点，因为 Transfer 的行为由边类型决定。

本次过程间求解器使用 Tai-e 提供的 `SetQueue`：它内部基于 `LinkedHashSet` 去重，并提供队列式的入队和出队接口。A4 的 CHA 实现仍采用手写的 `LinkedHashSet + Iterator`，两者遵循同样的 Worklist 调度思想。

一次处理完成后，节点从待处理集合中移除；如果后续又有新的数据流信息到达，它仍然可以重新入队。

其本质仍然是求解一组相互依赖的数据流方程，直到分析结果稳定。

PA4 复用了 PA2 的 `CPFact`、抽象表达式求值和合并规则，但扩展了传播结构。**数据流求解框架的扩展发生在图与边语义这一层，而不是重新实现常量抽象域。**

## 6. 一次完整的常量传播过程

回到最开始的例子：

~~~java
static int addOne(int x) {
    return x + 1;
}

int a = 6;
int b = addOne(a);
int c = b - 3;
~~~

整个传播链可以写成：

| 阶段 | 信息 |
| --- | --- |
| 调用前 | `a = 6` |
| Call Edge | `x = 6` |
| 被调用方法内部 | `y = 7` |
| Return Edge | `b = 7` |
| 调用后 | `c = 4` |

对应的抽象值变化为：

$$
\begin{aligned}
a&=Constant(6),\\
x&=Constant(6),\\
y&=Constant(7),\\
b&=Constant(7),\\
c&=Constant(4).
\end{aligned}
$$

这里的 `y` 表示被调用方法内部保存 `x+1` 结果的中间变量；具体 IR 会显式引入此类临时变量。

如果只运行 PA2 的过程内常量传播，`addOne` 的返回值不能通过方法体计算得到，`b` 通常会被保守地处理为 NAC，进而使 `c` 也无法确定为唯一常量。

两种分析的差别不在于整数加法是否支持，而在于分析器能否看到并传播方法调用另一侧的数据流事实。

## 7. 精度边界：过程间不等于上下文敏感

过程间分析扩大了分析范围，却没有消除所有近似。

### 7.1 CHA 的过近似

CHA 基于类层次结构，而非实际的对象分配与运行时类型。

假设某个虚调用的声明类型有多个子类，即使程序只实例化其中一个，CHA 也可能把多个实现都加入调用图。

对常量传播而言，多余的调用边会带来更多需要合并的结果。如果两个候选方法分别返回常量 `1` 和 `2`，就可能得到：

$$
Constant(1)\sqcup Constant(2)=NAC.
$$

这属于调用图保守性带来的精度损失，而不是求值器算错了整数。

此外，本次作业采用简化的 Java 调用语义，不完整覆盖现代 Java 的所有方法分派情形，例如接口默认方法等扩展特性。

### 7.2 上下文不敏感导致不同调用位置的信息汇合

考虑：

~~~java
static int identity(int x) {
    return x;
}

int a = identity(1);
int b = identity(2);
~~~

从具体执行看，应当有：

$$
a=1,\qquad b=2.
$$

但如果两个调用点共享同一份被调用方法的数据流状态，那么它的形参 `x` 会接收两个值：

$$
Constant(1)\sqcup Constant(2)=NAC.
$$

随后返回值也可能退化为 NAC，影响两个调用位置。

这体现了**上下文不敏感（Context-insensitive）**分析的限制：它能够跨越方法边界，却不区分同一方法在不同调用上下文中的独立状态。

更精细的过程间分析需要进一步区分调用上下文。

### 7.3 本次并未解决别名与堆状态问题

PA4 仍然聚焦 int-like 类型的局部变量常量传播，没有建立完整的对象别名或堆内存更新模型。

因此，它不是一般意义上的精确过程间程序语义模拟。

另外，标准有限高度格上的单调数据流框架可以用于解释 Worklist 收敛，但完整的单调性论证还需要检查具体抽象运算。PA2 中针对除零的特殊规则就说明，不能仅凭使用了有限高度的抽象域，便无条件套用标准收敛定理。

这些限制并不否定过程间分析的价值。它们说明分析精度同时受调用图、上下文区分能力、抽象域和传递函数影响。

## 8. 从 PA1 到 PA4：分析框架的逐步扩展

回顾前四次作业：

| 作业 | 核心问题 | 主要机制 |
| --- | --- | --- |
| PA1 | 一个变量的值未来是否还会被使用？ | 后向活跃变量分析、迭代求解 |
| PA2 | 一个变量能否被确定为常量？ | 抽象值格、Meet/Transfer、Worklist |
| PA3 | 哪些语句不可达或赋值无用？ | 组合分析结果、可行边搜索、副作用约束 |
| PA4 | 常量信息如何跨越方法调用？ | CHA、Call Graph、ICFG、Edge Transfer |

这一演进体现了静态分析中的两条主线。

第一条是**抽象语义**：选择需要跟踪的程序性质，定义对应的 Fact、Meet 和 Transfer。

第二条是**程序结构**：从方法内 CFG，到调用图，再到包含过程间边的 ICFG。

PA4 最有价值的地方，是把这两条主线连接起来。

调用图负责估计可能发生的方法调用，ICFG 将调用关系变成可供传播的控制流结构，Edge Transfer 定义跨方法传递的信息变换，Worklist 则负责对整个系统求解。

整个架构可以概括为：

$$
\boxed{
\text{Call Graph}
\rightarrow
\text{ICFG}
\rightarrow
\text{Edge/Node Transfer}
\rightarrow
\text{Fixed Point}
}
$$

本次实现中，CHA 调用图构建与过程间常量传播的本地测试均已通过，其中 `InterCPTest` 的 4 项测试全部通过。在线隐藏测试结果尚未在本文记录。

与 PA2 相比，PA4 的新增内容不在常量本身，而在程序结构与信息流的建模。它展示了一个重要事实：**许多新的静态分析能力，并不需要推翻已有的数据流框架，而是通过扩展分析所依赖的程序结构和传递语义获得。**

---

**参考资料：** [Tai-e PA4 作业说明](https://tai-e.pascal-lab.net/pa4.html) · [Tai-e Assignments](https://github.com/pascal-lab/Tai-e-assignments) · [PA2：常量传播](/articles/tai-e-pa2-constant-propagation-worklist/) · [PA3：死代码检测](/articles/tai-e-pa3-dead-code-detection/)
