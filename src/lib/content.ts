import {getCollection,type CollectionEntry} from 'astro:content';
export type Article=CollectionEntry<'articles'>;
export const articleUrl=(id:string)=>`/articles/${id}/`;
export const seriesUrl=(id:string)=>`/series/${id}/`;
export const recent=(a:Article,b:Article)=>b.data.date.valueOf()-a.data.date.valueOf()||a.id.localeCompare(b.id);
export const sequence=(a:Article,b:Article)=>(a.data.order??99999)-(b.data.order??99999)||a.data.date.valueOf()-b.data.date.valueOf()||a.id.localeCompare(b.id);
export async function published(){
 const articles=(await getCollection('articles',({data})=>!data.draft)).sort(recent);
 const series=await getCollection('series',({data})=>!data.draft);
 const products=(await getCollection('products',({data})=>!data.draft)).sort((a,b)=>Number(b.data.featured)-Number(a.data.featured)||b.data.date.valueOf()-a.data.date.valueOf());
 const allSeries=await getCollection('series');const ids=new Set(articles.map(a=>a.id));
 for(const article of articles){if(article.data.series&&!allSeries.some(s=>s.id===article.data.series&&!s.data.draft))throw new Error(`Unknown or draft series: ${article.id}`);for(const id of article.data.related)if(!ids.has(id)||id===article.id)throw new Error(`Invalid related article: ${article.id} -> ${id}`);}
 for(const group of series){const orders=articles.filter(a=>a.data.series===group.id&&a.data.order!==undefined).map(a=>a.data.order);if(new Set(orders).size!==orders.length)throw new Error(`Duplicate order in series ${group.id}`);}
 for(const product of products)if(product.data.article&&!ids.has(product.data.article))throw new Error(`Invalid product article: ${product.id}`);
 return {articles,series,products};
}
export function connections(article:Article,all:Article[]){
 const linked=(a:Article,id:string)=>a.data.related.includes(id)||(a.body||'').includes(`/articles/${id}/`);
 const backlinks=all.filter(a=>a.id!==article.id&&linked(a,article.id));
 const related=all.filter(a=>a.id!==article.id).map(a=>({a,score:(linked(article,a.id)?100:0)+(a.data.series&&a.data.series===article.data.series?20:0)+a.data.tags.filter(t=>article.data.tags.includes(t)).length})).filter(a=>a.score>0).sort((a,b)=>b.score-a.score||recent(a.a,b.a)).slice(0,3).map(a=>a.a);
 return {related,backlinks};
}
