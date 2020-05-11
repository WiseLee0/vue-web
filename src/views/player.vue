<template>
  <div class="player">
    <canvas ref="canvas"></canvas>
    <div class="container">
      <div class="control">
        <MusicControl :picUrl="song.al.picUrl"
                      :duration="song.dt"
                      @nextSong="nextSong"
                      @preSong="preSong"
                      @changeMode="changeMode">
        </MusicControl>
      </div>
      <div class="musicLyric">
        <loading v-show="!lyric"></loading>
        <MusicLyric :lyric="lyric"
                    v-if="lyric"></MusicLyric>
      </div>
      <div class="ressemble">
        <loading v-show="!comment.length"></loading>
        <MusicComment :comment="comment"></MusicComment>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import Cherry from "../utils/cherry";
import Axios from "axios";
import config from "../config";
import Lyric from "../utils/lyric";
import MusicLyric from "@/components/musicLyric.vue";
import MusicControl from "@/components/musicControl.vue";
import MusicComment from "@/components/musicComment.vue";
import { mapMutations, mapGetters, mapActions } from "vuex";
import event from "../utils/event";
import Loading from "@/base/loading.vue";
@Component({
  computed: {
    ...mapGetters(["currentIndex", "playList"])
  },
  created() {
    (this as any).initEntry();
  },
  mounted() {
    (this as any).initCanvas();
  },
  components: {
    MusicLyric,
    MusicControl,
    MusicComment,
    Loading
  },
  beforeRouteLeave(to, from, next) {
    from.meta.keepAlive = false;
    next();
  },
  methods: {
    ...mapMutations({
      set_currentIndex: "SET_CURRENTINDEX",
      set_mode: "SET_MODE"
    }),
    ...mapActions(["playMode"])
  }
})
export default class Player extends Vue {
  private lyric: any = null;
  private song: any = {};
  private comment = [];
  private timer: any = null;
  /**
   * 获取歌词
   */
  initLyric(id: number) {
    Axios.get(`${config.music}/lyric?id=${id}`).then(res => {
      this.lyric = new Lyric(res.data.lrc.lyric);
    });
  }
  /**
   * 获取歌曲评论
   */
  initComment(id: number) {
    Axios.get(`${config.music}/comment/music?id=${id}`).then(res => {
      const arr: [] = res.data.hotComments;
      this.comment = arr.concat(res.data.comments.slice(0, 20));
    });
  }
  /**
   * 初始化所有数据
   */
  initEntry() {
    this.song = (this as any).playList[(this as any).currentIndex];
    this.initLyric(this.song.id);
    this.initComment(this.song.id);
    this._getSongUrl(this.song.id);
  }
  /**
   * 切换播放模式
   */
  changeMode(mode: number) {
    (this as any).set_mode(mode);
    let index = (this as any).currentIndex;
    (this as any).playMode((this as any).playList[index]);
  }
  /**
   * 切换上下首歌曲
   */
  preSong() {
    if (this.throttle()) return;
    let index = (this as any).currentIndex;
    if (index == 0) {
      index = (this as any).playList.length - 1;
    } else {
      index--;
    }
    (this as any).set_currentIndex(index);
  }
  nextSong() {
    if (this.throttle()) return;
    let index = (this as any).currentIndex;
    if (index == (this as any).playList.length - 1) {
      index = 0;
    } else {
      index++;
    }
    (this as any).set_currentIndex(index);
  }
  _getSongUrl(id: number) {
    Axios.get(`${config.music}/song/url?id=${id}`).then(res => {
      const musicUrl = res.data.data[0].url;
      event.$emit("onInit", musicUrl);
    });
  }
  throttle() {
    if (this.timer) return true;
    this.timer = setTimeout(() => {
      this.timer = null;
    }, 500);
    return false;
  }
  @Watch("currentIndex", { deep: true })
  watchIndex(n: any, o: any) {
    this.comment = [];
    this.lyric = null;
    this.initEntry();
  }
  /**
   * canvas背景，樱花飘落
   */
  private width: number = 0;
  private height: number = 0;
  private cherries: any[] = [];
  private INIT_CHERRY_BLOSSOM_COUNT: number = 30;
  private MAX_ADDING_INTERVAL: number = 10;
  private maxAddingInterval!: number;
  private addingInterval!: number;
  private context!: CanvasRenderingContext2D;
  initCanvas() {
    const canvas = this.$refs.canvas as HTMLCanvasElement;
    this.context = canvas.getContext("2d") as CanvasRenderingContext2D;
    this.width = canvas.width = window.innerWidth;
    this.height = canvas.height = window.innerHeight;
    this.addingInterval = this.maxAddingInterval = Math.round(
      (this.MAX_ADDING_INTERVAL * 1000) / this.width
    );
    this.createCherries();
    this.renders();
  }
  createCherries() {
    const length = Math.round(
      (this.INIT_CHERRY_BLOSSOM_COUNT * this.width) / 1000
    );
    for (let i = 0; i < length; i++) {
      const cherry = new Cherry(this, true);
      this.cherries.push(cherry);
    }
  }
  renders() {
    requestAnimationFrame(this.renders);
    this.context.clearRect(0, 0, this.width, this.height);
    this.cherries.sort(function(cherry1: any, cherry2: any) {
      return cherry1.z - cherry2.z;
    });
    for (var i = this.cherries.length - 1; i >= 0; i--) {
      if (!(this.cherries[i] as any).render(this.context)) {
        this.cherries.splice(i, 1);
      }
    }
    if (--this.addingInterval == 0) {
      this.addingInterval = this.maxAddingInterval;
      this.cherries.push(new Cherry(this, false));
    }
  }
}
</script>

<style  lang="stylus" rel="stylesheet/stylus">
@import '~@/config/color'
.player
  width 100%
  height 100%
  overflow hidden
  .container
    position absolute
    top 0
    left 0
    right 0
    bottom 0
    padding 70px 20px 70px 70px
    display flex
    flex-direction row
    .control
      height 100%
      width 350px
    .musicLyric
      flex 1
      height 100%
      position relative
      min-width 400px
    .ressemble
      height 100%
      max-width 350px
      min-width 300px
      padding 0 20px
      border-radius 0 20px 20px 20px
      overflow hidden
      position relative
</style>
