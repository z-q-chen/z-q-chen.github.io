export function readingTime(body='') {
  body=body.replace(/<details\b[^>]*>[\s\S]*?<\/details>/g,'');
  const han=(body.match(/[\u3400-\u9fff]/g)||[]).length;
  const words=(body.replace(/[\u3400-\u9fff]/g,' ').match(/[A-Za-z0-9]+/g)||[]).length;
  return Math.max(1,Math.ceil(han/400+words/220));
}
export function dateLabel(date:Date){return date.toISOString().slice(0,10).replaceAll('-','.');}
