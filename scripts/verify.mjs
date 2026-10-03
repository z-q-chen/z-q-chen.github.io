import {readFile,readdir,stat} from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {nextGeneration} from '../src/scripts/life.ts';
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
const c=9,r=9;const seed=coords=>{const a=new Uint8Array(c*r);for(const[x,y]of coords)a[y*c+x]=1;return a;};
const blinker=seed([[3,4],[4,4],[5,4]]);const vertical=seed([[4,3],[4,4],[4,5]]);assert.deepEqual(nextGeneration(blinker,c,r),vertical);assert.deepEqual(nextGeneration(vertical,c,r),blinker);
const block=seed([[3,3],[3,4],[4,3],[4,4]]);assert.deepEqual(nextGeneration(block,c,r),block);
const glider=seed([[3,2],[4,3],[2,4],[3,4],[4,4]]);let after=glider;for(let i=0;i<4;i++)after=nextGeneration(after,c,r);assert.deepEqual(after,seed([[4,3],[5,4],[3,5],[4,5],[5,5]]));assert.deepEqual(glider,seed([[3,2],[4,3],[2,4],[3,4],[4,4]]),'input should remain unchanged');
const edge=seed([[8,4],[0,4],[1,4]]);assert.deepEqual(nextGeneration(edge,c,r),seed([[0,3],[0,4],[0,5]]));
assert.ok(html.length>=13);assert.ok(files.some(f=>f.endsWith('feed.xml')));assert.ok(files.some(f=>f.endsWith('sitemap.xml')));
console.log(`Verified ${html.length} HTML pages, ${links} local links/assets, and Life oscillation, stability, glider motion, immutable updates and wrapping boundaries.`);
