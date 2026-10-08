import {published} from '../lib/content';
import type {APIRoute} from 'astro';
export const GET:APIRoute=async({site})=>{const {articles,series}=await published();const paths=['','articles/','series/','products/','links/','about/','cloudtogether/',...articles.map(a=>`articles/${a.id}/`),...series.map(s=>`series/${s.id}/`)];return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${paths.map(p=>`<url><loc>${new URL(p,site)}</loc></url>`).join('')}</urlset>`,{headers:{'Content-Type':'application/xml; charset=utf-8'}});};
