import *as types from './mutation-type'
import shuffle from '@/utils/shuffle'
import { setPlayHistory } from '@/utils/cache'

function findIndex(list: any, song: any) {
  return list.findIndex((item: any) => {
    return item.id === song.id
  })
}
// 点击歌曲
export const selectPlay = function ({ commit, state }: any, { list, index }: any) {
  commit(types.SET_SEQUENCELIST, list)
  if (state.mode === 2) {
    let randomList = shuffle(list)
    commit(types.SET_PLAYLIST, randomList)
    index = findIndex(randomList, list[index])
  } else {
    commit(types.SET_PLAYLIST, list)
  }
  commit(types.SET_CURRENTINDEX, index)
  commit(types.SET_PLAYING, true)
}

// 切换播放模式
export const playMode = function ({ commit, state }: any, song: any) {
  let index = 0
  switch (state.mode) {
    case 0:
      index = findIndex(state.sequenceList, song)
      commit(types.SET_CURRENTINDEX, index)
      commit(types.SET_PLAYLIST, state.sequenceList)
      break;
    case 1:
      break;
    case 2:
      let randomList = shuffle(state.sequenceList)
      commit(types.SET_PLAYLIST, randomList)
      index = findIndex(randomList, song)
      commit(types.SET_CURRENTINDEX, index)
      break;
    default:
      break;
  }
}

// 保存播放历史
export const savePlayHistory = function ({ commit }: any, song: any) {
  commit(types.SET_PLAYHISTORY, setPlayHistory(song))
}
