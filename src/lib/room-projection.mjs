/** Project a painted quadrilateral onto another plane, preserving its texture. */
export function homography(source, destination) {
  const rows=[];
  for(let i=0;i<4;i++){
    const [x,y]=source[i], [u,v]=destination[i];
    rows.push([x,y,1,0,0,0,-u*x,-u*y,u]);
    rows.push([0,0,0,x,y,1,-v*x,-v*y,v]);
  }
  for(let col=0;col<8;col++){
    let pivot=col;
    for(let row=col+1;row<8;row++)if(Math.abs(rows[row][col])>Math.abs(rows[pivot][col]))pivot=row;
    [rows[col],rows[pivot]]=[rows[pivot],rows[col]];
    if(Math.abs(rows[col][col])<1e-12)throw new Error('Degenerate projection');
    const divisor=rows[col][col];
    for(let j=col;j<=8;j++)rows[col][j]/=divisor;
    for(let row=0;row<8;row++)if(row!==col){const factor=rows[row][col];for(let j=col;j<=8;j++)rows[row][j]-=factor*rows[col][j];}
  }
  return [...rows.map(r=>r[8]),1];
}
export function projectPoint(h,[x,y]) {const w=h[6]*x+h[7]*y+1;return [(h[0]*x+h[1]*y+h[2])/w,(h[3]*x+h[4]*y+h[5])/w];}
export function cssMatrix(h) {return `matrix3d(${[h[0],h[3],0,h[6],h[1],h[4],0,h[7],0,0,1,0,h[2],h[5],0,1].map(v=>Number(v.toFixed(10))).join(',')})`;}
export const portalGeometry={
  video:{outer:[[1196,408],[1470,389],[1468,610],[1199,612]],inner:[[1217,435],[1400,423],[1401,582],[1220,580]]},
  images:{outer:[[804,81],[1316,34],[1324,379],[808,405]],inner:[[830,109],[1291,69],[1296,350],[833,376]]},
  book:{outer:[[287,576],[499,549],[532,574],[306,617]],inner:[[287,576],[499,549],[532,574],[306,617]]},
  music:{outer:[[830,470],[1060,470],[1060,609],[830,609]],inner:[[830,470],[1060,470],[1060,609],[830,609]]},
  games:{outer:[[735,408],[767,398],[781,419],[752,446]],inner:[[735,408],[767,398],[781,419],[752,446]]},
  about:{outer:[[476,350],[538,343],[538,400],[476,405]],inner:[[476,350],[538,343],[538,400],[476,405]]},
  drawer:{outer:[[918,646],[1074,647],[1074,805],[918,805]],inner:[[918,646],[1074,647],[1074,805],[918,805]]},
};
