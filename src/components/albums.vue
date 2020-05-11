<template>
  <div class="albums">
    <div class="albums-tip">
      <span>Recommended Albums</span>
      <span @click="changeAlbums">Change</span>
    </div>
    <div class="list">
      <div class="card"
           v-for="(item,index) in showAlbums"
           :key="item.id"
           ref="list"
           @click="toList(index)">
        <img v-lazy="item.picUrl">
        <span>{{item.name}}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Component, Watch } from "vue-property-decorator";
import { mapMutations } from "vuex";
@Component({
  created() {
    const w = window.innerWidth - 250;
    if (w <= 720) this.$data.number = 4;
    else this.$data.number = Math.floor(w / 170);
  },
  methods: {
    ...mapMutations({
      set_albums: "SET_ALBUMS"
    })
  }
})
export default class albums extends Vue {
  @Prop()
  albums!: [];
  private showAlbums: [] = [];
  private number: number = 1;
  private count: number = 1;
  @Watch("albums")
  watchAlbum(n: [], o: []) {
    this.showAlbums = n.slice(0, this.number) as [];
  }
  @Watch("showAlbums")
  watchShowAlbums(n: [], o: []) {
    const children = this.$refs.list as any;
    if (children) {
      setTimeout(() => {
        for (let i = 0; i < children.length; i++) {
          const element = children[i].children[0];
          element.style = "transform: none";
        }
      }, 300);
    }
  }
  /**
   * 更新歌单列表
   */
  changeAlbums() {
    if (Math.floor(this.albums.length / this.number) > this.count) {
      this.showAlbums = this.albums.slice(
        this.count * this.number,
        (this.count + 1) * this.number
      ) as [];
    } else {
      this.count = 0;
      this.showAlbums = this.albums.slice(0, this.number) as [];
    }
    const children = this.$refs.list as any;
    if (children) {
      this.$nextTick(() => {
        for (let i = 0; i < children.length; i++) {
          const element = children[i].children[0];
          if (i & 1) element.style = "transform:  translateY(20px)";
          else element.style = "transform:  translateY(-10px)";
        }
      });
    }
    this.count++;
  }
  /**
   * 点击歌单，进入歌单列表
   */
  toList(index: number) {
    (this as any).set_albums(this.showAlbums);
    this.$router.push({
      name: "songList",
      params: {
        index: index.toString()
      }
    });
  }
}
</script>

<style lang="stylus" scoped>
@import '~@/config/color'
.albums
  position relative
  width 100%
  min-width 720px
  padding-bottom 30px
  .albums-tip
    width 100%
    height 70px
    display flex
    flex-direction row
    justify-content space-between
    align-items center
    span:nth-child(1)
      font-size 18px
      font-weight 700
      letter-spacing 2px
    span:nth-child(2)
      font-size 14px
      color $theme
      font-weight 700
      cursor pointer
  .list
    display flex
    flex-direction row
    justify-content space-between
    .card
      display flex
      flex-direction column
      width 140px
      transition transform 0.3s linear
    .card:hover
      transform scale(1.1)
    img
      width 140px
      height 140px
      border-radius 10px 10px 0 10px
      cursor pointer
      transition transform 0.3s linear
    span
      font-size 14px
      margin-top 20px
      overflow hidden
      text-overflow ellipsis
      white-space nowrap
</style>