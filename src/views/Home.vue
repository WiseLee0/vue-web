<template>
  <div class="home">
    <div class="head">
      <Featured></Featured>
      <div class="head-right">
        <History class="history"></History>
      </div>
    </div>
    <Albums :albums="albums"></Albums>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import Featured from "@/components/featured.vue";
import Albums from "@/components/albums.vue";
import History from "@/components/history.vue";
import Axios from "axios";
import config from "../config";
@Component({
  components: {
    Featured,
    Albums,
    History
  },
  created() {
    (this as any).initData();
  }
})
export default class Home extends Vue {
  private albums = {};
  initData() {
    this._initAlbums();
  }
  _initAlbums() {
    Axios.get(`${config.music}/personalized?limit=18`).then(res => {
      this.albums = res.data.result;
    });
  }
}
</script>

<style lang="stylus" scoped>
@import '~@/config/color'
.home
  width calc(100% -300px)
  padding-left 250px
  padding-right 50px
  background-color $color-backgroud
  .head
    width 100%
    display flex
    flex-direction row
    justify-content space-between
    height 400px
    overflow hidden
    .head-right
      width 320px
      .history
        border-radius 10px 10px 0 10px
        overflow hidden
</style>