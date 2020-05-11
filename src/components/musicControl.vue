<template>
  <div class="musicControl">
    <div class="musicImg">
      <img v-lazy="picUrl">
      <div class="mask"></div>
    </div>
    <div class="icon-row">
      <i class="iconfont icon-xunhuan1"
         v-show="mode===0"
         @click="changeMode(1)"></i>
      <i class="iconfont icon-xunhuan"
         v-show="mode===1"
         @click="changeMode(2)"></i>
      <i class="iconfont icon-suiji"
         v-show="mode===2"
         @click="changeMode(0)"></i>
      <i class="iconfont icon-xihuan"></i>
      <i class="iconfont icon-yinpinliebiao"></i>
    </div>
    <el-slider v-model="sliderTime"
               :show-tooltip="false"
               :max="durationTime"
               class="slider"
               @change="moveSlider">
    </el-slider>
    <div class="show-time">
      <span>{{curTime?curTime:'00:00'}}</span>
      <span>{{formatTime(duration)}}</span>
    </div>
    <div class="play-row">
      <i class="iconfont icon-shangyishou"
         @click="preSong"></i>
      <i class="iconfont icon-bofang"
         v-show="!playing"
         @click="changePlaying"></i>
      <i class="iconfont icon-zanting"
         v-show="playing"
         @click="changePlaying"></i>
      <i class="iconfont icon-xiayishou"
         @click="nextSong"></i>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { Slider } from "element-ui";
import event from "@/utils/event";
import { mapGetters } from "vuex";

Vue.use(Slider);
@Component({
  computed: {
    ...mapGetters(["playing", "mode"])
  },
  mounted() {
    event.$on("playTime", (this as any).runTime);
  },
  beforeDestroy() {
    event.$off("playTime", (this as any).runTime);
  }
})
export default class musicControl extends Vue {
  @Prop()
  picUrl!: string;
  @Prop()
  duration!: number;
  private sliderTime: number = 0;
  private curTime: string = "";
  get durationTime() {
    return Math.floor(this.duration / 1000);
  }
  /**
   * 移动歌曲进度条
   */
  moveSlider(time: number) {
    event.$emit("changePlayTime", time);
  }
  /**
   * 音乐已播放时间
   */
  runTime(e: number) {
    this.sliderTime = Math.floor(e);
    this.curTime = this.formatTime(e * 1000);
  }
  /**
   * 派发歌曲模式
   */
  changeMode(mode: number) {
    this.$emit("changeMode", mode);
  }
  /**
   * 派发上一首事件
   */
  preSong() {
    this.$emit("preSong");
  }
  /**
   * 派发下一首事件
   */
  nextSong() {
    this.$emit("nextSong");
  }
  /**
   * 格式化时间
   */
  formatTime(duration: number): string {
    const time = Math.floor(duration / 1000);
    const min = Math.floor(time / 60);
    const sec = time % 60;
    return `${min < 10 ? "0" + min : min}:${sec < 10 ? "0" + sec : sec}`;
  }
  /**
   * 监听播放状态
   */
  changePlaying() {
    if (!(this as any).playing) event.$emit("onPlay");
    else event.$emit("onPause");
  }
}
</script>

<style  lang="stylus" rel="stylesheet/stylus">
@import '~@/config/color'
@import '~@/assets/iconfont.css'
.musicControl
  width 100%
  height 100%
  display flex
  flex-direction column
  align-items center
  .musicImg
    width 250px
    height 250px
    border-radius 20px 20px 0 20px
    overflow hidden
    position relative
    opacity 0.9
    img
      width 250px
      height 250px
    .mask
      position absolute
      top 0
      left 0
      width 100%
      height 100%
      background-color rgba(0, 0, 0, 0.5)
  .icon-row
    display flex
    flex-direction row
    justify-content space-between
    width 230px
    margin-top 20px
    .iconfont
      font-size 32px
      font-weight 700
      cursor pointer
    .iconfont:hover
      color $theme
  .slider
    width 230px
    margin-top 10px
    z-index 1
    .el-slider__bar
      background-color $theme
      height 4px
    .el-slider__button
      background-color $color
      border-color $theme
      width 12px
      height 12px
    .el-slider__runway
      background-color $color-low
      height 4px
  .show-time
    display flex
    flex-direction row
    justify-content space-between
    font-size 14px
    font-family Georgia, 'Times New Roman', Times, serif
    font-weight 700
    width 250px
  .play-row
    display flex
    flex-direction row
    justify-content space-between
    align-items center
    width 250px
    height 80px
    margin-top 20px
    cursor pointer
    i
      font-size 48px
      font-weight 700
      transition all 0.3s
    i:nth-child(2)
      font-size 70px
    i:nth-child(3)
      font-size 70px
    i:hover
      color $theme
      transform scale(1.1)
</style>
