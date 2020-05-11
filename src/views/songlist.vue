<template>
  <div class="songlist">
    <div class="songlist-left">
      <div class="coverImg">
        <img v-lazy="list.coverImgUrl"
             class="coverImg">
        <div class="mask"></div>
        <div class="change-icon">
          <i class="iconfont icon-zuoshuangjiantou"
             @click="preAlbum"></i>
          <i class="iconfont icon-youshuangjiantou"
             @click="nextAlbum"></i>
        </div>
      </div>
      <div class="descript"
           ref="descript">
        <div class="descriptScroll">
          <p v-html="processDescription"
             class="descript-text"></p>
        </div>
      </div>
    </div>
    <div class="songlist-center">
      <h1 v-html="list.name"></h1>
      <div class="tag">
        <span v-for="item in list.tags"
              :key="item">
          {{ item }}
        </span>
      </div>
      <loading v-show="!list.tracks"></loading>
      <div class="lists"
           ref="scrollList">
        <div style="position: relative">
          <div v-for="(item,index) in list.tracks"
               :key="item.id"
               @click="playSong(index)"
               class="row">
            <div class="row-left">
              <span>{{padding(index)}}</span>
              <span>{{ item.name }}</span>
            </div>
            <div class="row-right">
              <span>{{duration(item.dt)}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="songlist-right">
      <loading v-show="!comment.length"></loading>
      <MusicComment :comment="comment"></MusicComment>
    </div>
  </div>
</template>

<script lang="ts">
import BScroll from "@better-scroll/core";
import MouseWheel from "@better-scroll/mouse-wheel";
import ScrollBar from "@better-scroll/scroll-bar";
import { Vue, Component, Watch } from "vue-property-decorator";
import { mapGetters, mapActions } from "vuex";
import Axios from "axios";
import config from "../config";
import event from "@/utils/event";
import MusicComment from "@/components/musicComment.vue";
import Loading from "@/base/loading.vue";
BScroll.use(ScrollBar);
BScroll.use(MouseWheel);

@Component({
  computed: {
    ...mapGetters(["albums"])
  },
  methods: {
    ...mapActions(["selectPlay"])
  },
  created() {
    this.$data.curIndex = this.$route.params.index;
    this.$data.oneAlbum = (this as any).albums[this.$data.curIndex];
    (this as any).getDetail(this.$data.oneAlbum.id);
    (this as any).getComment(this.$data.oneAlbum.id);
  },
  mounted() {
    (this as any).initScroll();
  },
  components: {
    MusicComment,
    Loading
  },
  beforeRouteLeave(to, from, next) {
    if (to.name == "Player") {
      from.meta.keepAlive = true;
    } else {
      from.meta.keepAlive = false;
    }
    next();
  }
})
export default class albumsList extends Vue {
  private list = {
    description: "",
    coverImgUrl: ""
  };
  private comment = [];
  private oneAlbum = {};
  private curIndex: number = 0;
  private scrollList: any = null;
  private scrollDescript: any = null;
  private timer: any = null;
  private albumsLoading: boolean = true;
  /**
   * 获取歌单详情
   */
  getDetail(id: number) {
    Axios.get(`${config.music}/playlist/detail?id=${id}`).then(res => {
      this.list = res.data.playlist;
    });
  }
  /**
   * 获取歌单评论
   */
  getComment(id: number) {
    Axios.get(`${config.music}/comment/playlist?id=${id}`).then(res => {
      const arr: [] = res.data.hotComments;
      this.comment = arr.concat(res.data.comments.slice(0, 20));
    });
  }
  /**
   * 切换上一个歌单
   */
  preAlbum() {
    if (this.timer) return;
    this.list = {
      description: "",
      coverImgUrl: ""
    };
    this.comment = [];
    if (this.curIndex == 0) {
      this.curIndex = (this as any).albums.length - 1;
    } else {
      this.curIndex--;
    }
    this.oneAlbum = (this as any).albums[this.curIndex];
    (this as any).getDetail(this.$data.oneAlbum.id);
    (this as any).getComment(this.$data.oneAlbum.id);
    this.throttle();
  }
  /**
   * 切换下一个歌单
   */
  nextAlbum() {
    if (this.timer) return;
    this.list = {
      description: "",
      coverImgUrl: ""
    };
    this.comment = [];
    if (this.curIndex == (this as any).albums.length - 1) {
      this.curIndex = 0;
    } else {
      this.curIndex++;
    }
    this.oneAlbum = (this as any).albums[this.curIndex];
    (this as any).getDetail(this.$data.oneAlbum.id);
    (this as any).getComment(this.$data.oneAlbum.id);
    this.throttle();
  }
  /**
   * 节流
   */
  throttle() {
    this.timer = setTimeout(() => {
      this.timer = null;
    }, 1000);
  }
  /**
   * 转到播放页
   */
  playSong(index: number) {
    const list = (this.list as any).tracks;
    (this as any).selectPlay({ list, index });
    this.$router.push({
      name: "Player"
    });
  }
  /**
   * 处理下歌单描述
   */
  get processDescription() {
    const str = this.list.description.replace(/\n/g, "<br/>");
    return str;
  }
  /**
   * 个位补零
   */
  padding(index: number) {
    index++;
    if (index < 10) return "0" + index;
    else return index;
  }
  /**
   * 歌曲时长
   */
  duration(num: number) {
    const time = parseInt(num.toString().slice(0, -3));
    const min = this.padding(Math.floor(time / 60) - 1);
    const sec = this.padding((time % 60) - 1);
    return `${min}:${sec}`;
  }
  /**
   * 初始化滚动条
   */
  initScroll() {
    this.scrollList = new BScroll((this.$refs as any).scrollList, {
      scrollY: true,
      scrollbar: true,
      mouseWheel: {
        speed: 20,
        invert: false,
        easeTime: 300
      }
    });
    this.scrollDescript = new BScroll((this.$refs as any).descript, {
      scrollY: true,
      scrollbar: true
    });
  }
  /**
   * 刷新滚动条
   */
  @Watch("list.tracks", { deep: true })
  watchTracks(n: any, o: any) {
    this.$nextTick(() => {
      this.scrollList.refresh();
      this.scrollDescript.refresh();
    });
  }
}
</script>

<style lang="stylus" scoped>
@import '~@/config/color'
@keyframes rotate
  0%
    transform rotate(0)
  30%
    transform rotate(60deg) scale(0.9)
  50%
    transform rotate(0) scale(1)
  70%
    transform rotate(-60deg) scale(0.9)
  100%
    transform rotate(0)
.songlist
  display flex
  flex-direction row
  justify-content space-between
  position absolute
  top 0
  right 0
  bottom 0
  left 0
  padding 66px 20px 20px 70px
  .songlist-left
    width 300px
    display flex
    flex-direction column
    align-items center
    .coverImg
      width 250px
      height 250px
      position relative
      img
        width 100%
        height 100%
        border-radius 50%
        cursor pointer
        animation rotate 15s linear infinite
      .mask
        position absolute
        top 0
        bottom 0
        width 100%
        height 100%
        border-radius 50%
        background-color rgba(0, 0, 0, 0.3)
      .change-icon
        position absolute
        top 50%
        left -20px
        width calc(100% + 40px)
        transform translateY(-50%)
        display flex
        flex-direction row
        justify-content space-between
        i
          font-size 32px
          opacity 0.5
          cursor pointer
          transition 0.3s
        i:hover
          transform scale(1.3)
          color $theme
          font-weight 700
          opacity 0.7
    .descript
      height 300px
      padding 0 20px
      overflow hidden
      margin-top 40px
      position relative
      cursor pointer
      .descriptScroll
        position relative
      .descript-text
        font-family 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif
        letter-spacing 3px
        word-wrap break-word
        word-break break-word
        white-space normal
        color $theme
  .songlist-center
    display flex
    flex-direction column
    width 550px
    min-width 500px
    position relative
    h1
      margin-top 0
    .tag
      display flex
      flex-direction row
      span
        font-size 14px
        padding 3px 10px
        background-color $theme
        border-radius 8px 8px 0 8px
        margin 0 5px
        cursor pointer
        transition transform 0.3s
      span:hover
        transform scale(1.1)
    .lists
      height 100%
      overflow hidden
      position relative
      margin-top 20px
      .row
        display flex
        flex-direction row
        align-items center
        justify-content space-between
        height 60px
        border-radius 20px 20px 0 20px
        overflow hidden
        .row-left
          width 350px
          text-overflow ellipsis
          white-space nowrap
          overflow hidden
          span:nth-child(1)
            font-weight 700
            padding 0 20px
            transition all 0.5s
          span:nth-child(2)
            color $theme
            cursor pointer
        .row-right
          padding-right 20px
      .row:hover
        background-color $color-backgroud-high
        .row-left span:nth-child(1)
          color $theme
  .songlist-right
    width 300px
    height 100%
    border-radius 0 20px 20px 20px
    overflow hidden
    position relative
</style>