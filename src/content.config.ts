import {defineCollection,z} from 'astro:content';
import {glob} from 'astro/loaders';
const articles=defineCollection({loader:glob({pattern:'**/*.md',base:'./src/content/articles'}),schema:z.object({
 title:z.string(),description:z.string(),date:z.coerce.date(),updated:z.coerce.date().optional(),kind:z.enum(['学习计划','学习笔记','作业复盘','教程','思考','开发记录','随笔']),tags:z.array(z.string()).default([]),draft:z.boolean().default(true),featured:z.boolean().default(false),series:z.string().optional(),order:z.number().int().min(0).optional(),related:z.array(z.string()).default([])
})});
const series=defineCollection({loader:glob({pattern:'**/*.md',base:'./src/content/series'}),schema:z.object({title:z.string(),description:z.string(),label:z.string(),status:z.enum(['计划已发布','学习中','已完成']).default('计划已发布'),color:z.enum(['purple','mint','peach','yellow']).default('purple'),draft:z.boolean().default(true)})});
const products=defineCollection({loader:glob({pattern:'**/*.md',base:'./src/content/products'}),schema:z.object({title:z.string(),description:z.string(),url:z.string().url().refine(v=>/^https?:\/\//.test(v)),source:z.string().url().optional(),article:z.string().optional(),tags:z.array(z.string()).default([]),date:z.coerce.date(),draft:z.boolean().default(true),featured:z.boolean().default(false),color:z.enum(['purple','mint','peach','yellow']).default('mint')})});
export const collections={articles,series,products};
