import {defineConfig} from 'astro/config';
import {unified} from '@astrojs/markdown-remark';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
export default defineConfig({site:'https://z-q-chen.github.io',output:'static',trailingSlash:'always',markdown:{processor:unified({remarkPlugins:[remarkMath],rehypePlugins:[[rehypeKatex,{trust:false,strict:'warn'}]]})}});
