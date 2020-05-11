<template>
  <div class="music-comment">
    <h2>Comment</h2>
    <div class="scrollComment"
         ref="scrollComment">
      <div class="comment">
        <div v-for="item in comment"
             :key="item.id"
             class="card">
          <img v-lazy="item.user.avatarUrl">
          <div class="content">
            <span v-html="item.user.nickname"></span>
            <p v-html="item.content"></p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import BScroll from "@better-scroll/core";
import MouseWheel from "@better-scroll/mouse-wheel";
import ScrollBar from "@better-scroll/scroll-bar";
BScroll.use(ScrollBar);
BScroll.use(MouseWheel);
@Component({
  mounted() {
    (this as any).initScroll();
  }
})
export default class MusicComment extends Vue {
  private scrollComment: any = null;
  @Prop()
  comment!: any;
  initScroll() {
    this.scrollComment = new BScroll((this.$refs as any).scrollComment, {
      scrollY: true,
      scrollbar: true,
      mouseWheel: {
        speed: 20,
        invert: false,
        easeTime: 300
      }
    });
  }
  @Watch("comment", { deep: true })
  watchComment(n: any, o: any) {
    this.$nextTick(() => {
      this.scrollComment.refresh();
    });
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~@/config/color'
.music-comment
  width 100%
  height 100%
  h2
    display inline-block
  h2:after
    content ' '
    width 70%
    height 4px
    line-height 4px
    background $theme
    border-radius 2px
    display block
    margin 0 auto
  .scrollComment
    min-width 250px
    height 100%
    padding-right 20px
    overflow hidden
    position relative
    opacity 0.9
    .comment
      position relative
    .card
      display flex
      flex-direction row
      img
        width 50px
        height 50px
        margin-right 20px
        border-radius 50%
        overflow hidden
      .content
        display flex
        flex-direction column
        flex 1
        margin-bottom 20px
        font-size 14px
        p
          padding 15px 10px
          border-radius 0 20px 20px 20px
          background-color $color-backgroud-high
          color $theme
          letter-spacing 4px
          font-family 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif
</style>
