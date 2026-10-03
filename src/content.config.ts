import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
const articles = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/articles' }),
  schema: z.object({
    title: z.string(), description: z.string(), date: z.coerce.date(),
    kind: z.enum(['思考', '教程', '开发记录', '随笔']),
    tags: z.array(z.string()).default([]), draft: z.boolean().default(true)
  })
});
const works = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/works' }),
  schema: z.object({
    title: z.string(), description: z.string(), date: z.coerce.date(),
    kind: z.enum(['工具', '项目', '游戏', '动画', '交互实验']),
    tags: z.array(z.string()).default([]), draft: z.boolean().default(true),
    featured: z.boolean().default(false),
    channel: z.enum(['music', 'games', 'images', 'video', 'tools']).optional(),
    cover: z.string().regex(/^\/(?!\/)/).optional(),
    experience: z.string().refine(v => /^\/(?!\/)/.test(v) || /^https?:\/\//.test(v), 'Use a site path or HTTP(S) URL').optional(),
    source: z.string().url().refine(v => /^https?:\/\//.test(v), 'Use an HTTP(S) URL').optional()
  })
});
export const collections = { articles, works };
