import {getCollection} from 'astro:content';
import type {APIRoute} from 'astro';
import {channels} from '../data/channels';
export const GET:APIRoute=async({site})=>{const paths=['','works/','articles/','about/',...channels.map(e=>`collections/${e.id}/`),...(await getCollection('articles',({data})=>!data.draft)).map(a=>`articles/${a.id}/`),...(await getCollection('works',({data})=>!data.draft)).map(w=>`works/${w.id}/`)];return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${paths.map(p=>`<url><loc>${new URL(p,site)}</loc></url>`).join('')}</urlset>`,{headers:{'Content-Type':'application/xml; charset=utf-8'}});};
