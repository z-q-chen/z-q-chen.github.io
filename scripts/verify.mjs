import {readFile,readdir,stat} from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
const root=path.resolve('dist');
async function walk(dir){const entries=await readdir(dir,{withFileTypes:true});return(await Promise.all(entries.map(e=>e.isDirectory()?walk(path.join(dir,e.name)):path.join(dir,e.name)))).flat();}
const files=await walk(root),html=files.filter(f=>f.endsWith('.html'));let links=0;
for(const file of html){const body=await readFile(file,'utf8');assert.match(body,/<title>[^<]+<\/title>/);assert.match(body,/<html lang="zh-CN"/);assert.match(body,/name="description"/);assert.match(body,/name="viewport"/);
 for(const [,url]of body.matchAll(/(?:href|src)="([^"#]+)"/g)){
  if(!url.startsWith('/')||url.startsWith('//'))continue;const p=url.split(/[?#]/)[0];let target=path.join(root,decodeURIComponent(p));
  if(p.endsWith('/'))target=path.join(target,'index.html');
  assert.ok((await stat(target).catch(()=>null))?.isFile(),`${path.relative(root,file)} has broken local link: ${url}`);links++;
 }
}
for(const required of ['index.html','works/index.html','articles/index.html','about/index.html','feed.xml','sitemap.xml'])assert.ok(files.includes(path.join(root,required)),`Missing ${required}`);
const sitemap=await readFile(path.join(root,'sitemap.xml'),'utf8');
assert.ok(!/\/(lab|notes|research|projects)\//.test(sitemap),'Retired routes must not be advertised');
for(const page of ['index.html','works/index.html','articles/index.html','about/index.html']){
 const body=await readFile(path.join(root,page),'utf8');
 assert.ok(!/rcloneForLinux|llm_compress|CS336|轨道之间|微小的生命|回声记忆/.test(body),'Previous demonstration content must not appear as personal work');
}
console.log(`Verified ${html.length} HTML pages and ${links} local links/assets. New sections exist; retired material is absent from public collections.`);
