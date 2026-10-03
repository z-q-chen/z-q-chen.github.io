import assert from 'node:assert/strict';
import {homography,projectPoint,cssMatrix,portalGeometry} from '../src/lib/room-projection.mjs';
for(const viewport of [[1366,768],[390,844],[320,740]]){
 const [w,h]=viewport;
 for(const [name,g] of Object.entries(portalGeometry)){
  const source=g.outer, dest=[[w*.15,h*.12],[w*.85,h*.12],[w*.85,h*.88],[w*.15,h*.88]];
  for(const t of [0,.25,.5,.75,1]){
   const target=source.map((p,i)=>p.map((v,j)=>v+(dest[i][j]-v)*t));
   const matrix=homography(source,target);
   assert.ok(matrix.every(Number.isFinite),`${name}: non-finite matrix`);
   source.forEach((p,i)=>projectPoint(matrix,p).forEach((v,j)=>assert.ok(Math.abs(v-target[i][j])<1e-6,`${name}: corner mismatch`)));
   assert.ok(cssMatrix(matrix).startsWith('matrix3d('));
  }
  const inside=homography(g.inner,[[0,0],[w,0],[w,h],[0,h]]);
  g.inner.forEach((p,i)=>projectPoint(inside,p).forEach((v,j)=>assert.ok(Math.abs(v-[[0,0],[w,0],[w,h],[0,h]][i][j])<1e-6)));
 }
}
console.log('Verified 105 intermediate projections and 21 screen-to-page projections across desktop and mobile sizes.');
