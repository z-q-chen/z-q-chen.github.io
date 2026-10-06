---
title: CS229 机器学习：我的完整学习计划
description: 一条从基础推导、四次 PSet Gate 到最终项目的学习路线。用 Spring 2026 与 Fall 2025 资料，留下每一步的思考与产出。
date: 2026-10-06
kind: 学习计划
tags: [机器学习, CS229, 学习方法]
series: cs229
order: 0
featured: true
draft: false
---

**Stanford Spring 2026 × Fall 2025 · Full-Blood Self-Study Edition**

核心逻辑：

> **Spring 2026 学最新内容 → 2026 Study Edition 做即时练习 → Fall 2025 官方 PSet 做正式 Gate → 做完才看学生 Solution → 最后按 Stanford 流程完成 Final Project。**

---


## 准备：确认基础与主资源

### 0 · 建立课程总入口

先收藏核心资源，不要到处换教程。

**资源** [Spring 2026 官方主页](https://cs229.stanford.edu/index.html-spr26) · [2026 Study Edition](https://github.com/az9713/cs229-machine-learning-notes) · [2026 17讲 Companion](https://github.com/ajpaschka/cs229-companion) · [Fall 2025 官方主页](https://cs229.stanford.edu/index.html-fall25) · [Fall 2025 PSet 总仓库](https://github.com/vSebas/CS229-Machine-Learning)

**完成标准** 已收藏主资源；明确后续不随意更换主教程

### 1 · Prerequisite Check：线代、概率、NumPy

只预检，不系统重学；哪里不会补哪里。

**资源** [Linear Algebra Review](https://cs229.stanford.edu/notes2022fall/cs229-linear_algebra_review.pdf) · [Probability Review](https://cs229.stanford.edu/notes2022fall/cs229-probability_review.pdf) · [Python/NumPy Review](https://cs229.stanford.edu/notes2022fall/cs229-python_review_slides.pdf) · [Python Materials ZIP](https://cs229.stanford.edu/notes2022fall/cs229-python_review_materials.zip)

**完成标准** 能看懂矩阵求导、期望/方差/协方差、Gaussian；能使用 NumPy 向量化


## 阶段一：监督学习与 Gate 1

### 2 · Machine Learning Overview

先建立“机器学习到底在学习什么”的全局框架。

**资源** [2026 Lecture 1](https://az9713.github.io/cs229-machine-learning-notes/lecture-01.html)

**完成标准** 能解释 Dataset、Model/Hypothesis、Objective、Learning、Generalization 的关系

### 3 · Linear Regression

Least Squares、LMS、GD、Normal Equation、概率解释。

**资源** [2026 Lecture 2](https://az9713.github.io/cs229-machine-learning-notes/lecture-02.html)

**完成标准** 完成 exercises；自己推 MSE gradient、Normal Equation；能从 Gaussian noise 推 least squares

### 4 · Logistic Regression + Newton's Method

**资源** [2026 Lecture 3](https://az9713.github.io/cs229-machine-learning-notes/lecture-03.html)

**完成标准** 从 Bernoulli likelihood 独立推 loss、gradient；理解 Hessian 和 Newton Method

### 5 · GLM / Exponential Family / Softmax / Poisson

**资源** [2026 Lecture 4](https://az9713.github.io/cs229-machine-learning-notes/lecture-04.html)

**完成标准** 能解释 Gaussian、Bernoulli、Poisson 为什么能放进统一 GLM 框架

### 6 · Generative Classification：GDA + Naive Bayes

**资源** [2026 Lecture 5](https://az9713.github.io/cs229-machine-learning-notes/lecture-05.html)

**完成标准** 自己推 GDA；能解释 Generative vs Discriminative；理解 Naive Bayes 条件独立假设

### 7 · Bias / Variance / Regularization / Model Selection

**资源** [2026 Lecture 6](https://az9713.github.io/cs229-machine-learning-notes/lecture-06.html) · [Bias-Variance Slides](https://cs229.stanford.edu/notes2022fall/bias-variance.pdf)

**完成标准** 模型效果差时，能判断 bias、variance、data、optimization 哪个环节有问题

### 8 — Gate 1 · Fall 2025 PS1

先下载干净 ZIP；禁止先看展开目录里的 solution。

**资源** [PS1 官方作业包镜像 ZIP](https://github.com/vSebas/CS229-Machine-Learning/raw/refs/heads/main/ps1.zip) · [PS1 文件夹 / 做完后看答案](https://github.com/vSebas/CS229-Machine-Learning/tree/main/ps1)

**完成标准** Poisson、GLM convexity、linear classification、imbalanced classification 全部自己推导 + coding；完成后再对 solution，并写 Postmortem


## 阶段二：贝叶斯、核方法与 Gate 2

### 9 · Bayesian / MLE / MAP / L1 / L2 / Kernel

**资源** [Stanford Main Notes](https://cs229.stanford.edu/notes2022fall/main_notes.pdf) · [Ridge Regression](https://cs229.stanford.edu/notes2022fall/ridge-regression.pdf) · [Lasso Regression](https://cs229.stanford.edu/notes2022fall/lasso-regression.pdf)

**完成标准** 真正理解 MLE ↔ MAP ↔ Regularization；理解 Kernel Trick 的本质

### 10 · K-Means + GMM

**资源** [2026 Lecture 9](https://az9713.github.io/cs229-machine-learning-notes/lecture-09.html) · [K-Means Slides](https://cs229.stanford.edu/notes2022fall/kmeans.pdf) · [GMM Slides](https://cs229.stanford.edu/notes2022fall/gmms.pdf)

**完成标准** 能自己实现 K-Means；理解 GMM、latent variable，以及 GMM 与 K-Means 的联系

### 11 — Gate 2 · Fall 2025 PS2

**资源** [PS2 官方作业包镜像 ZIP](https://github.com/vSebas/CS229-Machine-Learning/raw/refs/heads/main/ps2.zip) · [PS2 文件夹 / Solution](https://github.com/vSebas/CS229-Machine-Learning/tree/main/ps2)

**完成标准** Bayesian regression、GDA、kernel、spam/NB、K-means 全部完成；之后才看 `*-sol.tex`


## 阶段三：树、EM、神经网络与 Gate 3

### 12 · Decision Trees + Bagging + Boosting / AdaBoost

**资源** [Decision Trees Slides](https://cs229.stanford.edu/notes2022fall/cs229-decision_trees_slides.pdf) · [Annotated Decision Trees](https://cs229.stanford.edu/notes2022fall/decision-trees-annotated.pdf) · [Boosting Slides](https://cs229.stanford.edu/notes2022fall/cs229-boosting_slides.pdf)

**完成标准** 能解释 Tree 为什么高 variance；理解 Bagging 和 Boosting 的不同

### 13 · EM + PCA

重点理解 latent variable 和优化视角，而不是背 E/M 两步。

**资源** [2026 Lecture 10](https://az9713.github.io/cs229-machine-learning-notes/lecture-10.html) · [EM Slides](https://cs229.stanford.edu/notes2022fall/em.pdf) · [PCA Slides](https://cs229.stanford.edu/notes2022fall/pca.pdf)

**完成标准** 能解释 EM 为什么不直接优化 marginal likelihood、为什么 likelihood 不下降；理解 PCA 的 variance / reconstruction / subspace 三个视角

### 14 · Neural Networks 1：Architecture / Representation

把它和自己的 ECHOMind 联系起来。

**资源** [2026 Lecture 7](https://az9713.github.io/cs229-machine-learning-notes/lecture-07.html)

**完成标准** 能从 CS229 理论连接到 Linear、MLP、ECHOMind，而不是重新背 NN

### 15 · Neural Networks 2：Backprop / Computational Graph / Autodiff

**资源** [2026 Lecture 8](https://az9713.github.io/cs229-machine-learning-notes/lecture-08.html)

**完成标准** 手推简单网络 backward；理解 PyTorch autograd 实际做什么；能映射到 ECHOMind

### 16 — Gate 3 · Fall 2025 PS3

**资源** [PS3 官方作业包镜像 ZIP](https://github.com/vSebas/CS229-Machine-Learning/raw/refs/heads/main/ps3.zip) · [PS3 文件夹 / Solution](https://github.com/vSebas/CS229-Machine-Learning/tree/main/ps3)

**完成标准** Decision Trees、AdaBoost、Semi-Supervised EM、Simple NN 全部完成，并写 PS3 Postmortem


## 阶段四：现代模型、强化学习与 Gate 4

### 17 · Diffusion Models 1：Forward Noise / Reverse Process / ELBO

**资源** [2026 Lecture 11](https://az9713.github.io/cs229-machine-learning-notes/lecture-11.html)

**完成标准** 能画出 forward/reverse process；理解基本 diffusion training objective

### 18 · Diffusion Models 2：Denoising / Adaptation

**资源** [2026 Lecture 12](https://az9713.github.io/cs229-machine-learning-notes/lecture-12.html)

**完成标准** 完成 exercises；推荐做一个 2D toy diffusion / denoising experiment

### 19 · Representation / Contrastive Learning

这一节点直接连接 CLIP、InternVideo、Video Understanding。

**资源** [2026 Lecture 13](https://az9713.github.io/cs229-machine-learning-notes/lecture-13.html)

**完成标准** 理解 embedding geometry、contrastive objective、semantic similarity；推荐做 tiny contrastive experiment

### 20 · Language Modeling + Attention

不要重复重新写 Attention，而是从 ML 视角重新理解自己的 ECHOMind。

**资源** [2026 Lecture 14](https://az9713.github.io/cs229-machine-learning-notes/lecture-14.html)

**完成标准** 能解释 autoregressive objective、next-token learning、Attention 与 representation 的关系

### 21 · Efficient Transformers / Prompting vs Training / In-Context Learning

**资源** [2026 Lecture 16](https://az9713.github.io/cs229-machine-learning-notes/lecture-16.html)

**完成标准** 分清 parameter learning、fine-tuning、prompting、in-context learning

### 22 · Reinforcement Learning：MDP / Bellman / Value / Policy / Policy Gradient

**资源** [2026 Lecture 18](https://az9713.github.io/cs229-machine-learning-notes/lecture-18.html)

**完成标准** 能自己写 Bellman Equation；理解 value iteration 与 policy gradient 各自在优化什么

### 23 — Gate 4 · Fall 2025 PS4

**资源** [PS4 官方作业包镜像 ZIP](https://github.com/vSebas/CS229-Machine-Learning/raw/refs/heads/main/ps4.zip) · [PS4 文件夹 / Solution](https://github.com/vSebas/CS229-Machine-Learning/tree/main/ps4)

**完成标准** MNIST NN、MDP、CartPole、PCA 全部完成。至此 CS229 核心 PSet 正式毕业

### 24 · PPO + RL for LLMs

把 RL 与 LLM 第一次真正接起来。

**资源** [2026 Lecture 20](https://az9713.github.io/cs229-machine-learning-notes/lecture-20.html)

**完成标准** 能画出 LM → Reward → Policy Optimization；理解 PPO / RLHF / RL for LLM 的基本坐标系


## 阶段五：综合复习与最终项目

### 25 · Comprehensive Review：闭卷式综合训练

尽量不用 AI。

**资源** [Fall 2022 Midterm Review](https://cs229.stanford.edu/notes2022fall/CS_229_Fall_2022_TA_Lecture__Midterm_Review.pdf) · [另一套 Midterm Review](https://cs229.stanford.edu/materials/midterm-review.pdf) · [TA Materials 总目录](https://cs229.stanford.edu/notes2022fall/)

**完成标准** 不借助 AI 能独立推 Logistic、GLM、GDA、EM、PCA、Backprop、Bellman 等核心内容

### 26 · Final Project Proposal

先定义 Problem、Dataset、Metric、Baseline、Method、Experiment Plan。

**资源** [Proposal 示例](https://github.com/gazcn007/cs229-ml-proposal) · [Proposal LaTeX](https://github.com/gazcn007/cs229-ml-proposal/blob/main/cs229-proposal.tex)

**完成标准** 写出自己的 Proposal；必须先定义 baseline，禁止一开始直接堆 Transformer / Agent

### 27 · Baseline First

先把数据 pipeline、baseline、evaluation 跑通，再上复杂模型。

**资源** Video 方向参考：[Flow Project](https://github.com/vincent65/flowing-to-learn) · Quant 方向重点参考：[Spring 2026 S&P500 Project](https://github.com/pellucide/sp500_macro_forecast-)

**完成标准** 有一个完整、可运行、可复现、可比较的 baseline

### 28 · Milestone

Preliminary Result + Error Analysis + Next Steps

**资源** [Fall 2025 Milestone 目录](https://github.com/vSebas/CS229-Machine-Learning/tree/main/CS_229_Project_Milestone) · [Milestone LaTeX](https://github.com/vSebas/CS229-Machine-Learning/blob/main/CS_229_Project_Milestone/cs229-milestone.tex)

**完成标准** 已有真实实验结果；能说明当前方法失败在哪里、下一步为什么这样改

### 29 · Ablation + Robustness + Error Analysis

**资源** [Options Mispricing Project](https://github.com/TheClassicTechno/DetectMispricedOptionsResearch_CS229) · [Machine Learning Cannot Beat AR(1)](https://github.com/mauber91/cs229-final-project)

**完成标准** 至少有 baseline comparison、ablation、robustness check、error analysis；允许并记录 negative result

### 30 · Final Report + Poster + GitHub + Blog Summary

**资源** [Stanford Project Guidelines](https://cs229.stanford.edu/materials/projectGuidelines.pdf) · [2025 Poster 示例](https://docs.google.com/presentation/d/1yqQVlgoIGQJtpYfX-JJkUdi18qTVGc0x1rFVwWsGShk/edit)

**完成标准** Clean GitHub Repo + 约 5 页 Final Report + Poster + 3 分钟讲解 + Blog Project Summary


---

## 每个普通 Lecture 的固定学习循环

```text
Lecture
   ↓
理解核心问题
   ↓
Study Edition Exercises
   ↓
自己推导 / 小实验
   ↓
AI Dialogue
   ↓
写 Learning Note
   ↓
进入下一节点
```

建议每个 Learning Note 保留：

- Before Learning：我原来怎么理解？
- Core Question：这一讲到底解决什么？
- Key Derivation：最重要的数学推导是什么？
- Implementation Insight：如何映射到代码？
- Connections：和之前 / 之后哪些知识连接？
- After Learning：我的理解发生了什么变化？
- Open Questions：还有什么没真正搞懂？

---

## Assignment Gate 固定流程

PS1 / PS2 / PS3 / PS4 全部遵循：

```text
下载官方作业 ZIP
        ↓
禁止看 Solution
        ↓
自己完成 Written
        ↓
自己完成 Coding
        ↓
运行实验
        ↓
Debug
        ↓
全部完成
        ↓
查看学生 Solution
        ↓
对比思路
        ↓
Postmortem
```

Postmortem 至少记录：

- 哪些题不会？
- 为什么不会？
- 哪一步推导错了？
- Coding bug 属于什么类型？
- Student Solution 有没有更好的思路？
- 这一套 PSet 暴露了什么知识漏洞？

---

## 最终课程知识主线

```text
Prerequisite Check
        ↓
Linear Regression
        ↓
Logistic Regression
        ↓
GLM
        ↓
GDA / Naive Bayes
        ↓
Bias / Variance / Regularization
        ↓
PS1
        ↓
Bayesian / Kernel / K-Means
        ↓
PS2
        ↓
Decision Trees / Boosting
        ↓
GMM / EM
        ↓
Neural Networks / Backprop
        ↓
PS3
        ↓
Diffusion
        ↓
Representation Learning
        ↓
PCA
        ↓
Transformer / LLM / ICL
        ↓
Reinforcement Learning
        ↓
PS4
        ↓
RL for LLM
        ↓
Comprehensive Review
        ↓
Final Project
```

---

## 课程最终目标

这门课不是为了“看完 Stanford CS229”。

真正训练的是：

```text
Problem
   ↓
Identify Problem Class
   ↓
Choose Model
   ↓
Derive
   ↓
Implement
   ↓
Experiment
   ↓
Debug
   ↓
Evaluate
   ↓
Read Papers
   ↓
Improve
```

最终目标是获得从**问题 → 数学 → 模型 → 实现 → 实验 → 研究**的完整机器学习能力。
