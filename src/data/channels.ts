/** Published products opt into a shelf; GitHub repositories are never imported automatically. */
export const channels = [
  {id:'music', label:'音乐', icon:'music', note:'一些声音', empty:'还在听，慢慢做。'},
  {id:'games', label:'游戏', icon:'games', note:'玩一会儿', empty:'下一场游戏，慢慢来。'},
  {id:'images', label:'图像', icon:'images', note:'画点什么', empty:'下一幅画，还在酝酿。'},
  {id:'video', label:'影像', icon:'video', note:'让想象动起来', empty:'下一部，还在酝酿。'},
  {id:'tools', label:'工具', icon:'tools', note:'小小发明', empty:'给新的小东西，留点位置。'},
] as const;
const kindChannels: Record<string,string> = {游戏:'games',动画:'video',交互实验:'games'};
export function channelOf(data:{channel?:string;kind:string}) { return data.channel || kindChannels[data.kind] || 'tools'; }
export const legacyEntries = [
  {id:'book',href:'/articles/'}, ...channels.map(c=>({id:c.id,href:`/collections/${c.id}/`})),
  {id:'about',href:'/about/'},{id:'drawer',href:'/works/'}
].filter(c=>c.id!=='tools');
