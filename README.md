# ECHO · 学习与创造

一个面向长期写作与产品发布的个人博客。Astro 静态生成，暖白纸面、蜡笔颗粒线条与边缘手绘插画；所有页面共用背景；首页、归档和系列页共用文章便签。公开身份只使用 ECHO。

## 本地使用

```sh
npm ci
ASTRO_TELEMETRY_DISABLED=1 npm run build
npm run verify
ASTRO_TELEMETRY_DISABLED=1 npm run preview
```

Node.js 24。开发可使用 `ASTRO_TELEMETRY_DISABLED=1 npm run dev`。文章支持 Markdown、代码高亮、KaTeX 数学公式、目录、阅读进度。无外部字体请求；数学字体与样式随站点发布。

## 内容关系

- `/articles/`：独立文章，以时间、类型与标签检索。
- `/series/`：课程或长期实践，以学习顺序串联文章。系列不是文章的存储目录，也不等于学习完成进度。
- `/products/`：每个产品直接打开独立的网站，可附制作记录与源码链接。
- `/links/`：常用书签和小店。
- `/about/`：个人介绍与 GitHub 等个人渠道。
- 页头搜索条：在当前页面实时搜索文章、系列与产品，不跳转搜索页。`/` 聚焦搜索，Esc 收起结果；旧 `/search/` 入口继续兼容。
- `/feed.xml`：文章 RSS。

草稿不会进入公开页面、搜索、RSS 和 sitemap。旧 works、collections、room、research、notes、projects、lab 地址保留跳转。

## 写一篇文章

复制 `templates/article.md` 到 `src/content/articles/稳定文件名.md`。`kind` 可用：系列总览、学习计划、学习笔记、作业复盘、教程、思考、开发记录、随笔。准备发布时设 `draft: false`。首页突出 `featured: true` 的最新文章，否则显示最新文章。

独立文章不填 series。CS229 后续笔记填写：

```yaml
series: cs229
order: 1
related: [cs229-learning-plan]
```

`order` 只决定系列顺序，不等于已学完讲数。已发布文章的顺序值不能重复。下一篇可用 2、3……；也可以预留 10、20 等空隙。前后篇、系列目录根据已发布文章自动生成。

`related` 指向其他文章文件名，适用于跨课程的显式关联。正文链接到 `/articles/文章文件名/` 也会生成反向引用。相同系列和标签作为自动关联补充。不存在的引用、草稿系列、重复顺序会使构建失败，避免上线错误关系。

可填写 `updated` 显示修订日期。文件名决定永久链接，发布后尽量保持稳定。正文图片放 public 下并使用绝对路径。数学公式使用 `$...$` 与独占一行的 `$$...$$`。

## 开始另一门课程

复制 `templates/series.md` 到 `src/content/series/课程ID.md`。设置真实状态、描述与颜色，发布后文章填入对应 series ID 即可。状态手工维护：计划已发布、学习中、已完成。不自动用发文数推断学习完成度。

## 发布产品

产品在自己的仓库开发，可部署为 `https://z-q-chen.github.io/XXX/`。产品的构建基础路径设置为 `/XXX/`，后端另行托管。

复制 `templates/product.md` 到 `src/content/products/产品ID.md`。填写真实 `url`；`article` 可链接本站的制作记录，`source` 可链接源码。设置 `draft: false` 后，直接产品入口进入首页、产品页和搜索。不要把课程镜像或第三方作品当成个人成品。

## 维护书签和小店

编辑 `src/data/links.ts`。书签按 group 分组，支持 title、可选 description、url、color；课程学习资料直接放在学习计划中。shop 保存用户提供的小店网址，作为外部服务入口呈现。可用颜色：purple、mint、peach、yellow。

## 阅读次数与排除本人

作者设置不放在公开导航中；普通访问 `/preferences/` 不显示作者开关。使用 https://z-q-chen.github.io/preferences/?owner=on 在常用浏览器开启作者模式。该链接只是浏览器计数排除入口，不是身份认证或私人后台；静态页面与源码仍是公开的。该浏览器只读取计数，绝不发送增量请求。每个设备/浏览器都要开启一次；清除存储后需重新开启。这是统计排除偏好，不是登录或管理权限。

计数由 soxft/busuanzi 公开服务 `https://busuanzi.9420.ltd/api` 提供。GET 只读，POST 计数；仅发送文章规范网址，忽略查询参数和片段。文章在可见页停留约 8 秒计入一次，当前浏览器同一篇 30 分钟内不重复增加；本地预览不统计，存储不可用时保守地不增加。失败显示“—”，不显示虚构计数。

这是上线后的累计阅读次数，不是唯一人数，受第三方服务、浏览器设置和拦截器影响。接口失败不影响正文阅读。实现位于 `src/lib/views.mjs` 和 `src/components/ViewCount.astro`，服务地址可替换。

## 发布

提交 main 后，GitHub Actions 构建、校验并发布。PR 只执行检查。回退使用新的 revert 提交，保留历史，不强制推送。

CS229 · Course Map 是系列总览，order 为 0。总览不计入章节编号；后续笔记从 1 开始。正文先展示六阶段路线、学习方法与项目目标，31 个详细节点及全部原资源保留在默认收起的阶段清单内。折叠清单不计入首页显示的主文阅读时长。代码高亮统一使用浅色 github-light 主题。

设计与实现参考：

- https://maggieappleton.com/garden-history ：关联阅读与持续更新。
- https://docs.astro.build/en/guides/markdown-content/ ：内容与 Markdown 处理。
- https://katex.org/docs/node ：本地数学排版。
- https://github.com/soxft/busuanzi/wiki/API ：阅读次数 API。
