export default class Lyric {
  public lines: string[] = []
  public times: string[] = []
  constructor(str: string) {
    const patt = new RegExp(/\[(\d+:\d+.\d+)\](.*)\n/g);
    let result;
    while ((result = patt.exec(str)) != null) {
      this.times.push(this._transformTime(result[1]))
      this.lines.push(result[2].trim())
    }
  }
  private _transformTime(str: string) {
    let result = 0
    const min = parseInt(str.match(/([0-9]+)\:/)![1]) * 60
    const sec = parseInt(str.match(/\:([0-9]+)\./)![1])
    const ms = parseFloat('0' + '.' + str.match(/\.([0-9]+)/)![1])
    result = min + sec + ms
    return result.toString()
  }
  curLine(time: string) {
    if (!this.times.length) return
    for (let i = 0; i < this.times.length; i++) {
      if (parseFloat(time) <= parseFloat(this.times[i])) return i
    }
  }
}
