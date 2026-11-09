---
title: "软件分析 · Tai-e"
label: "Software Analysis"
description: "从数据流分析的数学原理到 Tai-e 框架的实际实现，记录软件分析课程的推导、源码阅读与作业实践。"
status: 学习中
color: purple
draft: false
---

软件分析研究如何在**不实际运行程序**的情况下，推导程序可能具有的性质。从控制流图到数据流方程，从不动点到通用求解器，这个系列沿着课程作业把理论和实现连接起来。

这里不把作业当成待填写的 TODO 清单：先理解分析所要回答的问题，再推导规则、阅读框架的调用链，最后回到实现、测试和容易出错的边界。

**当前已整理三篇：** PA1 讨论活跃变量分析与迭代求解器；PA2 讨论常量传播的抽象值格、数据流方程与 Worklist；PA3 则组合前两种分析结果，通过 CFG 可行边搜索和副作用检查识别死代码。后续继续沿课程顺序讨论静态分析方法及其实现。

资料：[Tai-e 官方课程与作业说明](https://tai-e.pascal-lab.net/) · [PA1](https://tai-e.pascal-lab.net/pa1.html) · [PA2](https://tai-e.pascal-lab.net/pa2.html) · [PA3](https://tai-e.pascal-lab.net/pa3.html) · [Tai-e 作业仓库](https://github.com/pascal-lab/Tai-e-assignments)
