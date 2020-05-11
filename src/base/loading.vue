<template>
  <div class="loading">
    <img width="50"
         height="50"
         src="../assets/loading.gif">
    <p class="desc">{{title}}</p>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
@Component
export default class App extends Vue {
  @Prop({
    default: "正在加载中"
  })
  title = "正在加载中";
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~@/config/color'
@import '~@/assets/iconfont.css'
.loading
  position absolute
  width 100%
  top 50%
  transform translateY(-50%)
  text-align center
  z-index 99
  .desc
    color $theme
</style> 
