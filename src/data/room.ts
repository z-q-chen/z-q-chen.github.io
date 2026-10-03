/** Set href only after the independently deployed product really exists. */
export const roomEntries = [
  { id: 'book', label: '翻翻本子', name: '桌边的本子', hint: '思考、教程，和一些随手写下的东西。', empty: '本子还空着', note: '第一篇，慢慢写。', x: 18, y: 52, w: 17, h: 10, origin: '27% 57%', channel: 'articles', href: '' },
  { id: 'music', label: '听点什么', name: '一张唱片', hint: '声音与音乐的实验。', empty: '唱片还没录好', note: '新的声音，会留在这里。', x: 54, y: 46, w: 15, h: 14, origin: '61% 54%', channel: 'music', href: '' },
  { id: 'games', label: '玩一会儿', name: '小小游乐场', hint: '游戏，和可以动手玩的东西。', empty: '下一场游戏，还在酝酿', note: '先让魔方转一圈。', x: 46, y: 37, w: 8, h: 12, origin: '49% 43%', channel: 'games', href: '' },
  { id: 'images', label: '看看画', name: '墙上的画', hint: '图像与生成艺术。', empty: '下一幅画，留在这里', note: '墙上的风景是房间插画的一部分。', x: 52, y: 4, w: 34, h: 35, origin: '69% 22%', channel: 'images', href: '' },
  { id: 'video', label: '打开电视', name: 'ECHO 影像频道', hint: '视频、动画，和流动的想象。', empty: '下一部，正在酝酿', note: '现在还没有发布影像。', x: 78, y: 38, w: 18, h: 24, origin: '86% 49%', channel: 'video', href: '' },
  { id: 'about', label: '认识 ECHO', name: '你好，我是 ECHO', hint: '', empty: '', note: '', x: 30, y: 33, w: 6, h: 8, origin: '33% 37%', channel: 'about', href: '' },
  { id: 'drawer', label: '拉开抽屉', name: '抽屉里的东西', hint: '工具、成品，还有暂时分不了类的小实验。', empty: '抽屉里还没有成品', note: '给未来的新东西，留一点位置。', x: 60, y: 62, w: 8, h: 18, origin: '64% 71%', channel: 'all', href: '' },
] as const;
const kindChannels: Record<string, string> = { 游戏: 'games', 动画: 'video', 交互实验: 'games' };
export function channelOf(data: { channel?: string; kind: string }) {
  return data.channel || (kindChannels[data.kind] || 'tools');
}
