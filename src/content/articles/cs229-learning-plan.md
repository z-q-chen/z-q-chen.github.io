---
title: CS229 · Course Map
description: 从基础推导到四次作业，再到一个可复现的机器学习项目。
date: 2026-10-06
kind: 系列总览
tags: [机器学习, CS229]
series: cs229
order: 0
featured: true
draft: false
---

以 Spring 2026 的公开讲义为主线，穿插 Fall 2025 的四次作业。这里保存学习路线；推导、实验和作业复盘会作为独立文章，陆续加入 [CS229 系列](/series/cs229/)。

## 学习路线

<ol class="course-route">
<li><h3>Warm-up</h3><p>线性代数、微积分、概率与 NumPy。先做预检，遇到缺口再补。</p></li>
<li><h3>Supervised learning</h3><p>回归、分类、GLM、GDA 与泛化。<strong>PSet 1</strong> 检验推导与实现。</p></li>
<li><h3>Probability & kernels</h3><p>贝叶斯、正则化、SVM、核方法与聚类。完成 <strong>PSet 2</strong>。</p></li>
<li><h3>Models & representations</h3><p>树与集成、EM、PCA、神经网络与反向传播。完成 <strong>PSet 3</strong>。</p></li>
<li><h3>Modern ML & reinforcement learning</h3><p>扩散、对比学习、Attention、MDP 与策略梯度。完成 <strong>PSet 4</strong>，再连接 PPO 与语言模型。</p></li>
<li><h3>Build something</h3><p>综合复习后，围绕一个问题，完成基线、实验与最终项目。</p></li>
</ol>

## 学习与复盘

每讲只留下三个东西：**一个核心问题、一段关键推导、一个可运行的小实验**。先独立思考，再用讨论或 AI 检查理解，最后写成笔记。

四次作业都先完成书面题与代码，再参考学生解答。复盘聚焦：错在哪里、为什么错、下一次如何验证，避免把答案抄成笔记。

## 最终项目

先定问题、数据与指标，再跑通基线。用消融、稳健性检查和失败案例解释结果，而不是只展示一个分数。

最终留下 **可复现的仓库、报告、海报与项目文章**。选题可以沿视频理解或量化方向展开，以实际实验决定下一步。

## 资料与清单

[Spring 2026 官方入口](https://cs229.stanford.edu/index.html-spr26) · [Fall 2025 官方入口](https://cs229.stanford.edu/index.html-fall25)\
[Study Edition 社区讲义](https://github.com/az9713/cs229-machine-learning-notes) · [公开视频 Companion](https://github.com/ajpaschka/cs229-companion) · [PSet 镜像](https://github.com/vSebas/CS229-Machine-Learning)

这份路线按知识依赖重排，不是官方课表。社区讲义整理了 17 讲公开课程；官方部分资料需要 Stanford 账号。下方按阶段展开具体任务与原始资源。

<details class="course-detail">
<summary>01 · Warm-up</summary>

<div class="course-step" data-course-step="0">

### Resource desk

固定使用官方入口、社区讲义与作业镜像，避免反复更换主线。

[Spring 2026 官方主页](https://cs229.stanford.edu/index.html-spr26) · [Study Edition 社区讲义](https://github.com/az9713/cs229-machine-learning-notes) · [公开视频 Companion](https://github.com/ajpaschka/cs229-companion) · [Fall 2025 官方主页](https://cs229.stanford.edu/index.html-fall25) · [PSet 镜像](https://github.com/vSebas/CS229-Machine-Learning)

</div>

<div class="course-step" data-course-step="1">

### Prerequisites

查漏补缺：矩阵求导、链式法则、期望与协方差、Gaussian、NumPy 向量化。

[Linear Algebra Review](https://cs229.stanford.edu/notes2022fall/cs229-linear_algebra_review.pdf) · [Probability Review](https://cs229.stanford.edu/notes2022fall/cs229-probability_review.pdf) · [Python/NumPy Review](https://cs229.stanford.edu/notes2022fall/cs229-python_review_slides.pdf) · [Python Materials ZIP](https://cs229.stanford.edu/notes2022fall/cs229-python_review_materials.zip)

</div>

</details>

<details class="course-detail">
<summary>02 · Supervised learning</summary>

<div class="course-step" data-course-step="2">

### The learning problem

说明数据、假设、目标函数、优化与泛化之间的关系。

[2026 Lecture 1](https://az9713.github.io/cs229-machine-learning-notes/lecture-01.html)

</div>

<div class="course-step" data-course-step="3">

### Linear regression

独立推导 MSE 梯度与正规方程；从 Gaussian 噪声解释最小二乘。

[2026 Lecture 2](https://az9713.github.io/cs229-machine-learning-notes/lecture-02.html)

</div>

<div class="course-step" data-course-step="4">

### Logistic regression

从 Bernoulli 似然推导损失与梯度，理解 Hessian 和 Newton 方法。

[2026 Lecture 3](https://az9713.github.io/cs229-machine-learning-notes/lecture-03.html)

</div>

<div class="course-step" data-course-step="5">

### Generalized linear models

用指数族与链接函数统一 Gaussian、Bernoulli、Poisson 和 Softmax。

[2026 Lecture 4](https://az9713.github.io/cs229-machine-learning-notes/lecture-04.html)

</div>

<div class="course-step" data-course-step="6">

### Generative classification

推导 GDA；比较生成式与判别式建模，理解 Naive Bayes 的条件独立假设。

[2026 Lecture 5](https://az9713.github.io/cs229-machine-learning-notes/lecture-05.html)

</div>

<div class="course-step" data-course-step="7">

### Generalization

用偏差、方差、数据和优化诊断模型；完成讲义练习。

[2026 Lecture 6](https://az9713.github.io/cs229-machine-learning-notes/lecture-06.html) · [Bias-Variance Slides](https://cs229.stanford.edu/notes2022fall/bias-variance.pdf)

</div>

<div class="course-step" data-course-step="8">

### PSet 1

独立完成 Poisson、GLM 凸性、线性分类与不平衡分类的推导和实现，再写复盘。

[PS1 作业镜像 ZIP](https://github.com/vSebas/CS229-Machine-Learning/raw/refs/heads/main/ps1.zip) · [PS1 文件夹 · 学生解答](https://github.com/vSebas/CS229-Machine-Learning/tree/main/ps1)

</div>

</details>

<details class="course-detail">
<summary>03 · Probability & kernels</summary>

<div class="course-step" data-course-step="9">

### Bayes, regularization & kernels

串起 MLE、MAP、L1/L2 正则；补上 SVM 的间隔与 Kernel Trick。

[Stanford Main Notes](https://cs229.stanford.edu/notes2022fall/main_notes.pdf) · [Ridge Regression](https://cs229.stanford.edu/notes2022fall/ridge-regression.pdf) · [Lasso Regression](https://cs229.stanford.edu/notes2022fall/lasso-regression.pdf)

</div>

<div class="course-step" data-course-step="10">

### Clustering

实现 K-Means，理解 GMM 的隐变量以及两者的联系。

[2026 Lecture 9](https://az9713.github.io/cs229-machine-learning-notes/lecture-09.html) · [K-Means Slides](https://cs229.stanford.edu/notes2022fall/kmeans.pdf) · [GMM Slides](https://cs229.stanford.edu/notes2022fall/gmms.pdf)

</div>

<div class="course-step" data-course-step="11">

### PSet 2

完成贝叶斯回归、GDA、核方法、垃圾邮件分类与聚类；完成后再对照学生解答。

[PS2 作业镜像 ZIP](https://github.com/vSebas/CS229-Machine-Learning/raw/refs/heads/main/ps2.zip) · [PS2 文件夹 · 学生解答](https://github.com/vSebas/CS229-Machine-Learning/tree/main/ps2)

</div>

</details>

<details class="course-detail">
<summary>04 · Models & representations</summary>

<div class="course-step" data-course-step="12">

### Trees & ensembles

解释树模型的高方差，比较 Bagging、Boosting 与 AdaBoost。

[Decision Trees Slides](https://cs229.stanford.edu/notes2022fall/cs229-decision_trees_slides.pdf) · [Annotated Decision Trees](https://cs229.stanford.edu/notes2022fall/decision-trees-annotated.pdf) · [Boosting Slides](https://cs229.stanford.edu/notes2022fall/cs229-boosting_slides.pdf)

</div>

<div class="course-step" data-course-step="13">

### EM & PCA

理解 EM 的下界与似然单调性；从方差、重构和子空间三个角度理解 PCA。

[2026 Lecture 10](https://az9713.github.io/cs229-machine-learning-notes/lecture-10.html) · [EM Slides](https://cs229.stanford.edu/notes2022fall/em.pdf) · [PCA Slides](https://cs229.stanford.edu/notes2022fall/pca.pdf)

</div>

<div class="course-step" data-course-step="14">

### Neural networks

理解网络的表示与结构，将 Linear、MLP 的理论对应到自己的实现。

[2026 Lecture 7](https://az9713.github.io/cs229-machine-learning-notes/lecture-07.html)

</div>

<div class="course-step" data-course-step="15">

### Backpropagation

手推简单网络的反向传播，再对应计算图与 PyTorch autograd。

[2026 Lecture 8](https://az9713.github.io/cs229-machine-learning-notes/lecture-08.html)

</div>

<div class="course-step" data-course-step="16">

### PSet 3

完成树、AdaBoost、半监督 EM 与简单神经网络，记录推导和实现中的错误。

[PS3 作业镜像 ZIP](https://github.com/vSebas/CS229-Machine-Learning/raw/refs/heads/main/ps3.zip) · [PS3 文件夹 · 学生解答](https://github.com/vSebas/CS229-Machine-Learning/tree/main/ps3)

</div>

</details>

<details class="course-detail">
<summary>05 · Modern ML & RL</summary>

<div class="course-step" data-course-step="17">

### Diffusion · fundamentals

画出加噪与反向过程，理解 ELBO 和基本训练目标。

[2026 Lecture 11](https://az9713.github.io/cs229-machine-learning-notes/lecture-11.html)

</div>

<div class="course-step" data-course-step="18">

### Diffusion · denoising

完成讲义练习，再做二维 toy diffusion 或去噪实验。

[2026 Lecture 12](https://az9713.github.io/cs229-machine-learning-notes/lecture-12.html)

</div>

<div class="course-step" data-course-step="19">

### Contrastive learning

理解 embedding 几何与对比目标；用小实验连接 CLIP、InternVideo 与视频理解。

[2026 Lecture 13](https://az9713.github.io/cs229-machine-learning-notes/lecture-13.html)

</div>

<div class="course-step" data-course-step="20">

### Language modeling & attention

从自回归目标、下一词预测与表示学习重新理解 Attention。

[2026 Lecture 14](https://az9713.github.io/cs229-machine-learning-notes/lecture-14.html)

</div>

<div class="course-step" data-course-step="21">

### Transformers & adaptation

区分参数学习、微调、Prompting 与 In-Context Learning。

[2026 Lecture 16](https://az9713.github.io/cs229-machine-learning-notes/lecture-16.html)

</div>

<div class="course-step" data-course-step="22">

### Reinforcement learning

写出 Bellman 方程，说明 Value Iteration 与 Policy Gradient 分别优化什么。

[2026 Lecture 18](https://az9713.github.io/cs229-machine-learning-notes/lecture-18.html)

</div>

<div class="course-step" data-course-step="23">

### PSet 4

完成 MNIST 神经网络、MDP、CartPole 与 PCA；复盘仍不熟悉的环节。

[PS4 作业镜像 ZIP](https://github.com/vSebas/CS229-Machine-Learning/raw/refs/heads/main/ps4.zip) · [PS4 文件夹 · 学生解答](https://github.com/vSebas/CS229-Machine-Learning/tree/main/ps4)

</div>

<div class="course-step" data-course-step="24">

### PPO & language models

串起语言模型、奖励与策略优化，建立 PPO、RLHF 和 RL for LLM 的基本框架。

[2026 Lecture 20](https://az9713.github.io/cs229-machine-learning-notes/lecture-20.html)

</div>

</details>

<details class="course-detail">
<summary>06 · Final project</summary>

<div class="course-step" data-course-step="25">

### Synthesis

不借助答案，独立推导 Logistic、GLM、GDA、EM、PCA、Backprop 与 Bellman。

[Fall 2022 Midterm Review](https://cs229.stanford.edu/notes2022fall/CS_229_Fall_2022_TA_Lecture__Midterm_Review.pdf) · [另一套 Midterm Review](https://cs229.stanford.edu/materials/midterm-review.pdf) · [TA Materials 总目录](https://cs229.stanford.edu/notes2022fall/)

</div>

<div class="course-step" data-course-step="26">

### Proposal

明确问题、数据、指标、基线和实验计划；先写可验证的假设。

[Proposal 示例](https://github.com/gazcn007/cs229-ml-proposal) · [Proposal LaTeX](https://github.com/gazcn007/cs229-ml-proposal/blob/main/cs229-proposal.tex)

</div>

<div class="course-step" data-course-step="27">

### Baseline

跑通数据、模型与评估，得到一个可复现、可比较的基线。

Video 方向参考：[Flow Project](https://github.com/vincent65/flowing-to-learn) · Quant 方向重点参考：[Spring 2026 S&P500 Project](https://github.com/pellucide/sp500_macro_forecast-)

</div>

<div class="course-step" data-course-step="28">

### Milestone

记录初步结果、失败案例与下一步实验，说明每项改动的理由。

[Fall 2025 Milestone 目录](https://github.com/vSebas/CS229-Machine-Learning/tree/main/CS_229_Project_Milestone) · [Milestone LaTeX](https://github.com/vSebas/CS229-Machine-Learning/blob/main/CS_229_Project_Milestone/cs229-milestone.tex)

</div>

<div class="course-step" data-course-step="29">

### Evaluation

做基线对比、消融、稳健性检查与错误分析；保留负面结果。

[Options Mispricing Project](https://github.com/TheClassicTechno/DetectMispricedOptionsResearch_CS229) · [Machine Learning Cannot Beat AR(1)](https://github.com/mauber91/cs229-final-project)

</div>

<div class="course-step" data-course-step="30">

### Release

整理可复现仓库、约五页报告、海报、三分钟讲解与项目总结。

[Stanford Project Guidelines](https://cs229.stanford.edu/materials/projectGuidelines.pdf) · [2025 Poster 示例](https://docs.google.com/presentation/d/1yqQVlgoIGQJtpYfX-JJkUdi18qTVGc0x1rFVwWsGShk/edit)

</div>

</details>

延伸时再看公平性、可解释性与隐私，参考 [Fall 2025 课程安排](https://cs229.stanford.edu/index.html-fall25)。
