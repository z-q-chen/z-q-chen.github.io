# ECHO · 创作房间

主页是一间可以探索的动态手绘工作室。银白短发、猫耳、粉色外套的 ECHO 戴着耳机坐在桌沿；本子、唱片、魔方、画框、电视、便签和抽屉是内容入口。插画与场景动画是网站设计素材，不列为作者的作品。

## 本地使用

Node.js 24 与 npm：

```sh
npm ci
ASTRO_TELEMETRY_DISABLED=1 npm run build
npm run verify
npm run preview
```

开发使用 `npm run dev`。没有外部字体、动画库、统计脚本或图片服务。

## 房间与物件

- `src/components/CreativeRoom.astro`：角色分层、物件动作、内容面板、放大与返回。
- `src/styles/room.css`：房间比例、画风、动画和移动布局。
- `src/data/room.ts`：七个入口的位置、文案、分类及真实产品地址。
- `public/room/studio.webp`：不含人物的房间画面。
- `public/room/echo.webp`：保留透明度的角色层；代码拆为头部、身体和脚部。

点击物件后先响应并推进镜头，再显示对应内容。每个入口有可分享的地址，例如 `/#book`、`/#video`；浏览器返回、Esc 和“回房间”都可退出。首次直接打开入口网址也会显示对应内容。地图提供明确的入口列表；手机可以横向滑动或点击方向按钮。控制点最小尺寸为 44px。

“动效”可暂停装饰动作，偏好只存在本机浏览器。系统的减少动态偏好默认暂停动画。灯光切换只影响房间显示；没有背景音乐自动播放。

## 在主仓库写文章

1. 将 `templates/article.md` 复制到 `src/content/articles/文章名.md`。
2. 填写标题、摘要、日期和正文；`kind` 可选思考、教程、开发记录、随笔。
3. 完成后设 `draft: false` 并提交。

文章会自动进入房间本子、文章列表、详情页、RSS 和 sitemap。文件名决定文章地址，发布后尽量保持稳定。模板不公开，草稿不进入任何公开集合。

## 独立仓库的产品

每个产品可以使用自己的框架和仓库，独立发布到 `https://z-q-chen.github.io/仓库名/`。产品构建时须设置该子路径作为资源和路由的基础路径。主站不负责构建产品，也不自动把 GitHub 仓库当作作品。

有两种接入方式：

1. **一个物件直接进入一个产品**：在 `src/data/room.ts` 设置对应入口的 `href`，如电视入口链接 `/你的影像产品仓库名/`。只有产品实际发布后才填写。主站独立链接不会自动保证跨仓库入场动画，产品可以后续添加自己的入场效果和回房间链接。
2. **一个物件收纳多个成品**：复制 `templates/work.md` 到 `src/content/works/作品名.md`，填写 `experience` 为真实产品地址、`source` 为仓库，设 `draft: false`。`channel` 决定放入哪个入口：`music` 唱片、`games` 魔方、`images` 画框、`video` 电视、`tools` 抽屉。抽屉也能浏览所有成品。`featured: true` 的内容优先排列；可选 `cover` 是放到 public 下的封面路径。

未指定 `channel` 时，游戏/交互实验放到魔方，动画放到电视，其他放到抽屉。当前真实文章与作品均为空，各物件显示真实空状态，不存在虚构内容或尚未部署的产品链接。

GitHub Pages 承载静态前端；需要在线生成、账户或存储的产品可以连接自己独立的后端，主站仍只保存入口。

## 内容页与维护

主站保留 `/articles/`、`/works/`、`/about/` 作为独立可访问内容页。旧版学习分叉和演示游戏已撤下，旧地址仅保留跳转。公开名字统一为 ECHO，不展示真实姓名、单位或所在地。

内容页使用 `src/layouts/Layout.astro` 和 `src/styles/global.css`，并保留页边绘画功能。涂鸦只存在当前页面内存，刷新后消失。

## 部署与回退

提交 `main` 后，`.github/workflows/deploy.yml` 构建、检查并部署到 `https://z-q-chen.github.io/`；PR 只检查。Pages Source 应配置为 GitHub Actions。回退通过 revert 相应提交，保留 Git 历史，不强制推送。

GitHub 项目站点路径：[官方说明](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages)。
