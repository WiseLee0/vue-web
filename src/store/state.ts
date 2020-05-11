import {
  getPlayHistory
} from '@/utils/cache.ts'
const state = {
  playing: false, // 播放状态
  playList: [], // 播放列表
  sequenceList: [], // 顺序列表
  mode: 0, // 播放模式 顺序播放0 循环单曲1 随机播放2 
  currentIndex: -1, // 播放索引
  albums: {}, // 歌单数据
  playHistory: getPlayHistory() // 播放历史
}
export default state