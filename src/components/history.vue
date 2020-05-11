<template>
  <div class="history">
    <h2>Recently Listened</h2>
    <div class="scrollList"
         ref="scrollList">
      <div class="list">
        <div v-for="(song,index) in playHistory"
             :key="song.id"
             class="song"
             @click="playSong(index)">
          <img v-lazy="song.al.picUrl">
          <div class="msg">
            <span>{{song.name}}</span>
            <span>{{getSinger(song.ar)}}</span>
          </div>
        </div>
      </div>
      <h3 v-if="!playHistory.length">你还没有听过歌曲哦~</h3>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { mapGetters, mapActions } from "vuex";
import BScroll from "@better-scroll/core";
import MouseWheel from "@better-scroll/mouse-wheel";
import ScrollBar from "@better-scroll/scroll-bar";
BScroll.use(ScrollBar);
BScroll.use(MouseWheel);
@Component({
  computed: {
    ...mapGetters(["playHistory"])
  },
  methods: {
    ...mapActions(["selectPlay"])
  },
  mounted() {
    (this as any).initScroll();
  }
})
export default class History extends Vue {
  initScroll() {
    new BScroll((this.$refs as any).scrollList, {
      scrollY: true,
      scrollbar: true,
      mouseWheel: {
        speed: 20,
        invert: false,
        easeTime: 300
      }
    });
  }
  getSinger(arr: any[]) {
    let res = "";
    arr.forEach(a => {
      res += a.name + "-";
    });
    return res.slice(0, -1);
  }
  playSong(index: number) {
    (this as any).selectPlay({ list: (this as any).playHistory, index });
    this.$router.push({
      name: "Player"
    });
  }
}
</script>

<style lang="stylus" scoped>
@import '~@/config/color'
.history
  width 100%
  height 100%
  font-family 'Times New Roman', Times, serif
  h2
    letter-spacing 2px
  .scrollList
    position relative
    height 100%
    overflow hidden
    border-radius 10px 10px 0 10px
    background-color $color-backgroud-high
    .list
      position relative
      padding 20px 20px 100px 20px
      .song
        display flex
        flex-direction row
        height 60px
        align-items center
        margin-bottom 20px
        cursor pointer
        img
          width 50px
          height 50px
          border-radius 10px 10px 10px 0px
          transition transform 0.3s
        .msg
          display flex
          flex-direction column
          justify-content space-between
          height 50px
          margin-left 20px
          span:nth-child(1)
            color $theme
          span:nth-child(2)
            font-size 12px
      .song:hover
        img
          transform scale(1.1)
    h3
      text-align center
      color $color-low
</style>