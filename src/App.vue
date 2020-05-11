<template>
  <div id="app">
    <SideMenu class="sideMenu"></SideMenu>
    <transition name="fade">
      <keep-alive>
        <router-view v-if="$route.meta.keepAlive"></router-view>
      </keep-alive>
    </transition>
    <transition name="fade">
      <router-view v-if="!$route.meta.keepAlive"></router-view>
    </transition>
    <Audio></Audio>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import SideMenu from "@/components/sideMenu.vue";
import Audio from "@/components/audio.vue";
@Component({
  components: {
    SideMenu,
    Audio
  }
})
export default class App extends Vue {}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~@/config/color'
@import '~@/assets/iconfont.css'
#app
  position absolute
  top 0
  left 0
  right 0
  bottom 0
  color $color
  background-color $color-backgroud
  overflow hidden
.sideMenu
  z-index 99
  position fixed
  top 50%
  left 0
  transform translateY(-50%)
.icon
  width 1em
  height 1em
  vertical-align -0.15em
  fill currentColor
  overflow hidden
.fade-enter-active, .fade-leave-active
  transition opacity 1s
.fade-enter, .fade-leave-to
  opacity 0
</style> 
