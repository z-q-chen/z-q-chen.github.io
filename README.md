# ECHO · 手绘小站

奶油色纸张、留白与直接绘制的 SVG 插画。主页用本子、耳机、魔方、画框、电视与工具盒分别代表文章、音乐、游戏、图像、影像和工具；没有预生成画面或抠图拼接。图标有轻微独立动作与悬停反馈，点击进入普通内容页面。

## 本地使用

Node.js 24 与 npm：

```sh
npm ci
ASTRO_TELEMETRY_DISABLED=1 npm run build
npm run verify
npm run preview
```

开发使用 `npm run dev`。无外部字体、动画库、统计脚本或图片服务。页面底部可暂停动效，也尊重系统减少动态偏好；“涂两笔”可临时在页边绘画，刷新后清除。

## 首页与插画

- `src/pages/index.astro`：恢复纸张手绘构图，显示六个图形入口和最新已发布内容。
- `src/components/SectionDoodle.astro`：六种直接绘制的 SVG 图标。
- `src/components/ChannelShelf.astro`：图形入口，首页展示六项，作品总页展示五个产品分类。
- `src/components/DoodleGarden.astro`：原版花、太阳、书本、纸飞机插画与互动。
- `src/styles/global.css`、`src/styles/shelves.css`：纸张视觉、排版、响应布局和图标动作。
- `src/data/channels.ts`：产品分类、标题与旧入口映射。

`/articles/` 放文章；`/works/` 汇总成品；`/about/` 是个人介绍。产品分类使用 `/collections/music/`、`games/`、`images/`、`video/`、`tools/`。旧 `/room/…/` 和 `/#频道名` 地址继续跳到对应页面，不再加载房间插画或透视过场。旧房间的绘图素材和专用控制器已移除，原版本可从 Git 历史恢复。

当前文章与真实作品为空，显示真实空状态；不把站点设计图标当作个人作品，也不将 GitHub 仓库自动列为成果。公开身份统一为 ECHO。

## 文章写在主仓库

复制 `templates/article.md` 到 `src/content/articles/文章名.md`，填写标题、摘要、日期及正文，`kind` 可选思考、教程、开发记录、随笔。准备发布后设置 `draft: false`。

文章会进入主页的最新文章、文章列表、详情页、RSS 与 sitemap。文件名决定网址，发布后尽量保持稳定。草稿和模板不进入公开集合。

## 成品在独立仓库开发

每件产品继续用独立仓库，可部署到 `https://z-q-chen.github.io/仓库名/`；产品的构建基础路径须设置为对应子路径。主站不负责构建产品。

复制 `templates/work.md` 到 `src/content/works/作品名.md`，`experience` 填真实产品网址，`source` 填仓库地址，`channel` 选 `music`、`games`、`images`、`video` 或 `tools`，完成后设 `draft: false`。`featured: true` 的作品优先出现在主页。可选 `cover` 指向 public 下的本地封面。

成品自动进入对应图标分类、作品总页与详情页；最新/精选内容也出现在主页。未填 `channel` 时，游戏和交互实验归 games，动画归 video，其余归 tools。分类路径放在 /collections 下，不占用产品的 /XXX/ 路径。

GitHub Pages 承载静态前端；需要生成、账户或存储的产品连接独立后端。

## 发布与回退

提交 main 后，`.github/workflows/deploy.yml` 构建、校验并部署到 `https://z-q-chen.github.io/`。PR 仅构建检查。回退通过新的 revert 提交，保留 Git 历史，不强制推送。
