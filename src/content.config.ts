import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
const notes = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/notes' }),
  schema: z.object({ title: z.string(), description: z.string(), date: z.coerce.date(), kind: z.enum(['工作室手记', '实验说明', '学习索引']), tags: z.array(z.string()), draft: z.boolean().default(false) })
});
export const collections = { notes };
