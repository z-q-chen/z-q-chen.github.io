/** Conway's Life on a toroidal grid. Pure logic shared with verification. */
export function nextGeneration(cells:Uint8Array,cols:number,rows:number):Uint8Array {
 const next=new Uint8Array(cells.length);
 for(let y=0;y<rows;y++)for(let x=0;x<cols;x++){
  let neighbors=0;
  for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++)if(dx||dy)neighbors+=cells[((y+dy+rows)%rows)*cols+(x+dx+cols)%cols];
  const i=y*cols+x;next[i]=neighbors===3||(cells[i]===1&&neighbors===2)?1:0;
 }
 return next;
}
