import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// 上线前把这里改为正式站点 URL（末尾不带 /），以生成规范的 SEO 链接。
export default defineConfig({
  site: 'https://jm-blog.pages.dev',
  integrations: [mdx(), sitemap()],
  markdown: {
    shikiConfig: { theme: 'github-dark-default' }
  }
});
