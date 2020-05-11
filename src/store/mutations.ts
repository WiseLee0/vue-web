import * as types from './mutation-type'
const mutations = {

  [types.SET_PLAYING](state: any, flag: any) {
    state.playing = flag
  },
  [types.SET_PLAYLIST](state: any, list: any) {
    state.playList = list
  },
  [types.SET_SEQUENCELIST](state: any, list: any) {
    state.sequenceList = list
  },
  [types.SET_MODE](state: any, mode: any) {
    state.mode = mode
  },
  [types.SET_CURRENTINDEX](state: any, index: any) {
    state.currentIndex = index
  },
  [types.SET_ALBUMS](state: any, albums: any) {
    state.albums = albums
  },
  [types.SET_PLAYHISTORY](state: any, data: any) {
    state.playHistory = data
  }
}
export default mutations