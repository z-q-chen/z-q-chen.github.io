# ECHO · Personal Journal

一份持续生长的个人博客。暖白纸色、深绿排版、少量陶土橙和直接绘制的植物插画。所有页面使用同一套设计；没有外部字体请求、统计脚本、动画库或图片服务。

## 本地使用

Node.js 24 与 npm：

```sh
npm ci
ASTRO_TELEMETRY_DISABLED=1 npm run build
npm run verify
npm run preview
```

开发使用 `npm run dev`。页脚可暂停动效，也尊重系统减少动态偏好。

## 页面与内容

- 首页：最新文章、成品预览、简短介绍、主题和分类入口。
- `/articles/`：按年份归档，支持文章类型及标签筛选。
- 文章页：阅读时间、目录、阅读进度，适配手机。
- `/works/`：真实成品，分音乐、游戏、图像、影像和工具。
- `/about/`：ECHO 的简短介绍。
- `/search/`：本地即时搜索标题、简介和标签；按 `/` 快速进入。
- `/feed.xml`：RSS。草稿不进入公开页面、搜索、RSS 或 sitemap。

当前只有一篇明确标为“站点说明”的开篇文章，真实作品仍为空。不会自动把 GitHub 仓库列为成果。公开身份仅用 ECHO。

## 发布文章

复制 `templates/article.md` 到 `src/content/articles/文章名.md`。填写标题、摘要、日期与正文，`kind` 可选思考、教程、开发记录、随笔。准备发布后设置 `draft: false`。

文章自动进入首页、年份归档、搜索、RSS 和 sitemap。文件名决定网址，发布后尽量保持稳定。图片放到 `public/`，正文使用绝对路径引用。

## 发布独立产品

每件产品在独立仓库开发，可以发布到 `https://z-q-chen.github.io/仓库名/`，其构建基础路径设置为对应子路径。主博客不负责构建这些产品。

复制 `templates/work.md` 到 `src/content/works/作品名.md`。`experience` 填真实产品网址，`source` 填仓库地址；`channel` 可选 `music`、`games`、`images`、`video`、`tools`；设置 `draft: false` 发布。`featured: true` 优先展示。可选 `cover` 指向 public 下的本地封面。

未填 `channel` 时，游戏和交互实验归 games，动画归 video，其余归 tools。分类页放在 `/collections/` 下，保留产品的 `/XXX/` 路径。需要账户、生成或存储的产品连接独立后端。

## 实现与发布

Astro 静态生成。视觉样式在 `src/styles/editorial.css`；插画在 `src/components/EditorialArt.astro`；产品分类在 `src/data/channels.ts`。旧 room、notes、research、lab、projects 地址保留跳转，旧插画版本可从 Git 历史恢复。

提交 main 后，`.github/workflows/deploy.yml` 构建、校验并发布到 `https://z-q-chen.github.io/`。PR 仅构建检查。回退使用新的 revert 提交，保留历史，不强制推送。
