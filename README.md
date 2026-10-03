# ECHO · Digital Lab

个人网站：作品、文章、关于。首页呈现个人介绍、精选作品和最近文章；只发布作者确认的真实内容。旧版学习分叉、网站生成的游戏及起始文章已撤下，旧网址跳转至新栏目。

## 本地使用

需要 Node.js 24 和 npm：

```sh
npm ci
npm run dev
```

检查并预览：

```sh
npm run build
npm run verify
npm run preview
```

## 发布文章

1. 复制 `templates/article.md` 到 `src/content/articles/你的文章名.md`。
2. 修改标题、摘要、日期和正文。`kind` 可选：**思考、教程、开发记录、随笔**；`tags` 用于主题标签。
3. 确认内容后把 `draft: true` 改为 `draft: false`，提交到 `main`。

文章会自动进入文章列表、首页的最近四篇、RSS 和 sitemap。文件名成为网址，已发布后尽量保持不变。模板存放在内容目录之外，不会被公开。

## 发布自己的成品

1. 复制 `templates/work.md` 到 `src/content/works/你的作品名.md`。
2. 修改标题、摘要、日期与正文。`kind` 可选：**工具、项目、游戏、动画、交互实验**。
3. `featured: true` 的作品优先显示在首页；首页最多显示三个，余下位置由最近发布的作品补充。
4. 可选字段：
   - `cover: /images/你的封面.png`：将图片放到 `public/images/`。
   - `experience: https://作品地址` 或站内路径：作品的使用或体验入口。
   - `source: https://源码地址`：公开代码入口。
5. 确认是自己完成并愿意公开的作品后，设为 `draft: false`。

作品页正文可以链接相关文章，文章也可以链接作品。新游戏或动画可作为独立页面加入 `src/pages/`，再把它的地址写入作品的 `experience` 字段。网站支持静态作品；需要后端的成品可以托管在独立服务后链接。

未填写 `draft` 的内容默认不发布。草稿不会进入详情页、首页、列表、RSS 或 sitemap。当前两个内容集合均为空，因此前台显示真实的空状态。

## 修改介绍

- 首页简短介绍：`src/pages/index.astro`。
- 完整介绍：`src/pages/about.astro`。
- 导航及页脚：`src/layouts/Layout.astro`。
- 视觉系统：`src/styles/global.css`。

公开名称统一为 ECHO，不展示真实姓名、单位或所在地。简介保持简短，作品与文章由作者确认后发布。

## 发布与回退

仓库：`https://github.com/z-q-chen/z-q-chen.github.io`。

在 Settings → Pages 将 Source 设为 **GitHub Actions**。提交 `main` 后，`.github/workflows/deploy.yml` 自动构建、检查并发布到 `https://z-q-chen.github.io`。PR 只检查，不发布。无需个人密钥。

出现问题时查看 Actions 的失败步骤。回退可通过 revert 相应提交，再等待自动发布；不要删除历史或强制推送。旧版仍可从 Git 历史恢复，本地原始源码归档也保留。

## 隐私与维护

无统计脚本、外部字体、登录与数据收集。依赖版本由 lockfile 固定。图片、源代码和正文应确认可公开后再提交；不要把密钥或私人材料放入仓库。
