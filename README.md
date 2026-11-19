# JM Blog

SAP FICO 顾问 / AI 创业者 JM 的个人品牌博客。Astro 静态站，内容以中文为主：AI 实战、工具实测、独立开发方法论。兼作外链基地（文章中自然插入自有站点外链，如 https://ilovepdftoo.cn ）。

## 技术栈

- Astro 5（全静态输出，零默认 JS）
- Markdown / MDX 内容（`@astrojs/mdx`）
- 内容集合 + zod schema 校验 frontmatter（title / date / description / tags 必填）
- 集成：`@astrojs/rss`（RSS）、`@astrojs/sitemap`（sitemap）

## 功能清单

- 首页（最新文章）+ 文章列表页 `/blog/` + 文章详情页 `/blog/<slug>/`
- 标签聚合 `/tags/` 与标签详情 `/tags/<tag>/`
- RSS：`/rss.xml`；Sitemap：`/sitemap-index.xml`
- SEO：每页独立 title/description/canonical + Open Graph / Twitter Card + 默认 OG 图（`public/og-default.svg`）
- 暗色模式：跟随系统 + 手动切换按钮，localStorage 记忆，无闪烁（head 内联脚本）
- 关于页 `/about`

## 本地开发

```bash
npm install        # 安装依赖
npm run dev        # 开发服务器 http://localhost:4321
npm run build      # 类型检查 + 构建到 dist/
npm run preview    # 本地预览构建产物
```

## 写新文章

在 `src/content/blog/` 新建 `.md`（或 `.mdx`）文件，frontmatter 必须包含：

```yaml
---
title: 文章标题
date: 2026-01-01
description: 一两句话摘要（用于列表与 SEO/OG）
tags: ["AI 实战", "SAP FICO"]
---
```

文件名即 URL slug（如 `my-post.md` → `/blog/my-post/`）。日期相同的文章按文件名稳定排序，建议每天不超过一篇，或文件名加序号。

### 内部链接与外部链接规范

- 内部链接一律使用站点根相对路径并带尾部斜杠，如 `[标签页](/tags/AI%20实战/)`、`[关于我](/about/)`，不要写完整域名，避免换域名后全站失效。
- 外部链接建议显式加 `rel` 提示搜索引擎该链接的性质：
  - 自有站点（如 PDF 工具站）：`[ilovepdftoo.cn](https://ilovepdftoo.cn)`，自然插入正文即可，这是正常外链 SEO 做法；
  - 不背书的第三方链接：`[示例](https://example.com){rel="nofollow noopener"}`；
  - 站内已有同主题文章时优先互链（正文 + 文末"延伸阅读"），比堆外链更有价值。
- 参考示例：`src/content/blog/consultant-indie-minimal-launch.md` 中的外链写法。

## 上线前必改

1. `astro.config.mjs` 中的 `site` 改为正式域名（末尾不带 `/`），RSS/canonical/OG/sitemap 都依赖它。
2. `src/consts.ts` 改站点标题与描述；`src/components/Header.astro` 改品牌名。
3. `public/og-default.svg` 建议换成 1200x630 PNG/JPG 真图（部分平台不支持 SVG OG 图）。
4. `src/pages/about.astro` 补充真实个人信息与联系方式。

## 部署

### 方案 A：Cloudflare Pages

1. 把项目推送到 GitHub（`git init` 后新建仓库并 push）。
2. Cloudflare Dashboard → Workers & Pages → Create → Pages → Connect to Git，选择该仓库。
3. 构建配置：
   - Framework preset：`Astro`
   - Build command：`npm run build`
   - Build output directory：`dist`
   - Node 版本：Settings → Environment variables 添加 `NODE_VERSION = 22`（或 20+）
4. Save and Deploy。之后每次 push 到生产分支自动构建。
5. 自定义域名：项目 → Custom domains → 添加域名，按提示加 CNAME。
6. 若 `npm run build` 里包含 `astro check`，首次构建会多装一次依赖，属正常现象；嫌慢可把 build command 换成 `npx astro build`。

命令行方式（可选）：`npm i -g wrangler && wrangler pages deploy dist --project-name=jm-blog`（首次会引导浏览器登录，登录动作需本人完成）。

### 方案 B：Vercel

1. 项目推送到 GitHub。
2. vercel.com 用 GitHub 登录 → Add New → Project → Import 该仓库。
3. 构建配置（Vercel 会自动识别 Astro，一般不用改）：
   - Framework Preset：`Astro`
   - Build Command：`npm run build`
   - Output Directory：`dist`
   - Node.js Version：22.x
4. Deploy。之后 push 自动部署，PR 会生成预览链接。
5. 自定义域名：Project → Settings → Domains 添加，按提示改 DNS（A 记录 76.76.21.21 或 CNAME cname.vercel-dns.com）。
6. 命令行方式（可选）：`npm i -g vercel && vercel --prod`（首次引导登录，需本人完成）。

### 部署后自检清单

- [ ] `https://<域名>/rss.xml` 可订阅
- [ ] `https://<域名>/sitemap-index.xml` 可访问
- [ ] 任一文章页查看源码：有 canonical、og:title、og:image
- [ ] 暗色模式切换正常、刷新后保持
- [ ] 移动端浏览无横向滚动

## 目录结构

```
jm-blog/
├── astro.config.mjs          # 站点 URL 与集成配置
├── package.json
├── tsconfig.json
├── public/                   # 原样复制的静态资源
│   ├── favicon.svg
│   └── og-default.svg        # 默认 OG 分享图
└── src/
    ├── consts.ts             # 站点标题/描述/作者
    ├── content.config.ts     # 内容集合 schema（title/date/description/tags）
    ├── content/blog/         # ★ 文章都在这里（Markdown/MDX）
    ├── components/           # BaseHead(SEO) / Header / Footer / ThemeToggle
    ├── layouts/              # Base.astro（通用）/ Post.astro（文章）
    ├── pages/                # 路由：index / blog / tags / about / rss.xml
    ├── styles/global.css     # 明暗主题 CSS 变量与排版
    └── utils/blog.ts         # 排序、日期格式化
```
