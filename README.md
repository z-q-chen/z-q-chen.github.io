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

作品页正文可以链接相关文章，文章也可以链接作品。推荐每个作品在独立仓库开发和部署，主站只保存作品说明、封面和链接。网站支持链接静态作品；需要后端的成品可以部署在独立服务后链接。

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

## 手绘视觉

暖白纸张、彩色线条和矢量小插画。首页与关于页的小花会轻轻摇头，悬停时招手，点击时转动；纸飞机可点击飞行，太阳的目光随鼠标轻微移动。盆栽、蝴蝶与笔触各有独立的轻微动效。页脚按钮可关闭全部装饰动效；系统的减少动态偏好默认关闭动效。无需外部字体、图片服务或动画库。

插画位于 `src/components/DoodleGarden.astro` 和 `src/components/Doodle.astro`，排版与配色在 `src/styles/global.css`。这些插画是页面装饰，不属于作者的作品列表。

## 仓库分工与作品接入

- `z-q-chen.github.io`：网站本身、文章正文、个人介绍及作品目录。
- 每个作品独立仓库：源代码、依赖、版本记录与部署流程。作品不需要使用主站的技术栈或视觉风格。
- 在作品部署完成后，主站增加一份 `src/content/works/作品名.md`；填写 `experience` 为实际体验地址、`source` 为作品仓库地址，再设 `draft: false`。文章制作记录仍写在 `src/content/articles/`。

GitHub Pages 项目站默认地址是 `https://z-q-chen.github.io/作品仓库名/`（子路径）。主站作品介绍位于 `/works/作品名/`；介绍与体验是两个独立地址。使用构建工具时，作品仓库需要把资源和路由的基础路径设为 `/作品仓库名/`，具体配置取决于作品的框架。

目前不能自行创建 `作品名.z-q-chen.github.io`。若以后拥有自己的域名，可以给各作品仓库分别配置自定义子域名，例如 `作品名.example.com`，再更新主站的 `experience`。主站不自动收录全部 GitHub 仓库；确认属于自己的成品后添加条目。

参考：[GitHub Pages 站点类型](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages)、[自定义域名](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/about-custom-domains-and-github-pages)。

## 页边涂鸦

页脚的“涂两笔”开启页面画笔，可以选色、撤销、清空和结束；“移动页面”切换到滚动浏览，点“继续画”恢复画笔。支持鼠标或触控；按 Esc 也可结束。涂鸦仅存在当前页面内存中，不保存或上传，刷新或跳转页面会消失。浏览内容时涂鸦层不拦截点击。实现位于 `src/components/PageSketch.astro`。
