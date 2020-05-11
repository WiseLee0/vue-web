<template>
  <div class="lyric-wrapper"
       ref="lyricScroll">
    <div class="lyric">
      <p ref="lyricLine"
         v-for="(line,index) in lyric.lines"
         :class="currentLine === index +1 ?'highLine':''"
         :key="index">{{line}}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import BScroll from "@better-scroll/core";
import MouseWheel from "@better-scroll/mouse-wheel";
import ScrollBar from "@better-scroll/scroll-bar";
import Lyric from "../utils/lyric";
import event from "@/utils/event";
BScroll.use(ScrollBar);
BScroll.use(MouseWheel);
@Component({
  mounted() {
    (this as any).initScroll();
    event.$on("playTime", (this as any).positionLyric);
  }
})
export default class MusicLyric extends Vue {
  private lyricScroll: any = null;
  @Prop()
  lyric!: Lyric;
  private currentLine: number = 0;
  /**
   * 播放与歌词联动
   */
  positionLyric(time: string) {
    this.currentLine = this.lyric.curLine(time)!;
  }
  /**
   * 初始化滚动条
   */
  initScroll() {
    this.lyricScroll = new BScroll((this.$refs as any).lyricScroll, {
      scrollY: true,
      scrollbar: true,
      mouseWheel: {
        speed: 20,
        invert: false,
        easeTime: 300
      }
    });
  }
  @Watch("lyric.lines", { deep: true })
  watchLyric(n: any, o: any) {
    this.$nextTick(() => {
      this.lyricScroll.refresh();
    });
  }
  @Watch("currentLine")
  watchLine(n: any, o: any) {
    if (n !== o) {
      if (n > 6) {
        let lineEl = (this.$refs.lyricLine as any)[n - 6];
        this.lyricScroll.scrollToElement(lineEl, 1000);
      } else {
        this.lyricScroll.scrollToElement(0, 0, 1000);
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~@/config/color'
.lyric-wrapper
  width 100%
  height 100%
  padding 0 20px 0 0
  overflow hidden
  -webkit-box-reflect below 10px -webkit-linear-gradient(bottom, rgba(255, 255, 255, 0.4) 0%, transparent 40%, transparent 100%)
  .lyric
    position relative
    p
      text-align center
      font-size 20px
    .highLine
      color $theme
      font-weight 700
      transform scale(1.3)
      font-family 'Times New Roman', Times, serif
      transition all 0.3s
</style>