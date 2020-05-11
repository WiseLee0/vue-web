import storage from 'good-storage';
const SEARCH_KEY = '__search__'
const PLAY_KEY = '__play__'
const FAVORITE_KEY = '__favorite__'
function insertArr(arr: any, val: any, compare: any, maxlen: any) {
  const index = arr.findIndex(compare)
  if (index === 0) return
  if (index > 0) arr.splice(index, 1)
  arr.unshift(val)
  if (maxlen && arr.length > maxlen) arr.pop()
}

export function setPlayHistory(song: any) {
  let songs = storage.get(PLAY_KEY, [])
  insertArr(songs, song, (item: any) => {
    return item.id === song.id
  }, 50)
  storage.set(PLAY_KEY, songs)
  return songs
}

export function getPlayHistory() {
  return storage.get(PLAY_KEY, [])
}