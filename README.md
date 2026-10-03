# 陈正佺 · 数字实验室

面向 `https://z-q-chen.github.io` 的个人数字实验室。Astro + TypeScript + Markdown，静态输出；交互实验只在浏览器运行。

## 本地运行

需要 Node.js 24、npm。

```sh
npm ci
npm run dev
```

打开终端显示的本机网址。构建和检查：

```sh
npm run build
npm run verify
npm run preview
```

## 内容与结构

- `src/pages/`：首页、研究、项目、游乐场、笔记、关于、404。
- `src/content/notes/`：Markdown 笔记，按 schema 检查；`draft: true` 不进入页面、索引、RSS 或 sitemap。
- `src/data/lab.ts`：项目和实验目录。
- `src/pages/lab/`：可独立运行的实验页面。
- `src/styles/global.css`：全站视觉系统、手机布局与减少动画偏好。
- `src/layouts/Layout.astro`：导航、页面元信息、页脚。

新增笔记示例：

```md
---
title: 你的标题
description: 简短说明
date: 2026-10-03
kind: 工作室手记
tags: [实验, 记录]
draft: true
---

## 问题

## 尝试

## 观察与下一步
```

`kind` 支持：工作室手记、实验说明、学习索引。确认内容可公开后，将 `draft` 改为 `false`。文件名会成为网址，不要随意改动已经公开的文件名。新增栏目可在 `Layout.astro` 与 `src/pages/` 中扩展。

新增实验：添加 `src/pages/lab/你的实验.astro`，并在 `src/data/lab.ts` 中登记；独立脚本放在 `src/scripts/`。部署静态站点不支持服务器端数据库和密钥；未来有后端的项目可以部署到独立服务后从项目档案链接。

## GitHub Pages 发布

1. 在账户 `z-q-chen` 下创建 **公开仓库** `z-q-chen.github.io`，默认分支 `main`。首次使用连接工具上传时，先勾选 Add a README file 以生成起始提交。
2. 将本目录中的源代码上传到仓库根目录，包括 `.github/workflows/deploy.yml` 和 `package-lock.json`。不要上传 `node_modules`、`.astro`、本地配置或私密内容。
3. 在仓库 Settings → Pages → Build and deployment 中，把 Source 设为 **GitHub Actions**。
4. 在 Actions 运行 **Publish digital laboratory**，或向 `main` 提交一次变更。
5. 等待 build 与 deploy 成功，实际打开网站和几个子页面核验。

提交到 `main` 后会自动重新发布。PR 只构建并验证，不发布。工作流仅在部署任务中申请 Pages 与身份令牌写入权限，不需要个人密钥。

网站配置不设置 `base`，因为这是用户根站点仓库。不要添加 CNAME；当前目标是 GitHub 自带域名。

## 内容依据

公开背景和仓库信息读取于 2026-10-03：`https://github.com/z-q-chen`。课程和教程分叉均标注为学习入口；没有推断学位、职务、论文、作业完成度或实验成绩。首批笔记为网站起始说明，三个游乐场作品为本站制作的演示。没有发布本地项目的非公开资料。

## 运维与回退

- 依赖版本由 `package-lock.json` 固定；升级依赖后重新构建和验证。
- 若发布失败，查看 Actions 的失败步骤；网站保留上次成功发布的版本。
- 回退已发布变更：在 GitHub 撤销相关提交（revert），再等待自动部署。无需删除历史或强制推送。
- 发布后核对首页、笔记直达链接、三个实验、手机布局以及 `/404.html`。

## 隐私与交互

无统计脚本、无外部字体、无登录、无服务器数据收集。小游戏最高轮次只写本机浏览器 localStorage。动画可暂停，默认尊重减少动画偏好，标签隐藏时停止渲染；游戏和模拟在标签隐藏时暂停。生命网格支持方向键与空格，游戏支持 1–4 键。
