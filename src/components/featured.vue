<template>
  <div class="featured">
    <el-carousel class="banner">
      <el-carousel-item v-for="item in banner"
                        :key="item">
        <img :src="item">
      </el-carousel-item>
    </el-carousel>
    <div class="tip">
      <h2>Featured for you</h2>
      <span>See Other</span>
    </div>
    <div class="novel">
      <div v-for="item in novel"
           :key="item">
        <img v-lazy="item">
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Component } from "vue-property-decorator";
import { Carousel, CarouselItem } from "element-ui";
Vue.use(Carousel);
Vue.use(CarouselItem);

@Component
export default class albums extends Vue {
  banner: string[] = [
    "http://puui.qpic.cn/media_img/lena/PIC8npsib_580_1680/0",
    "http://puui.qpic.cn/media_img/lena/PIC0ikbqn_580_1680/0",
    "http://puui.qpic.cn/media_img/lena/PICgraf2a_580_1680/0",
    "http://puui.qpic.cn/media_img/lena/PICtorjuf_580_1680/0",
    "http://puui.qpic.cn/media_img/lena/PIC2mhh6r_580_1680/0"
  ];
  novel: string[] = [
    "http://cdn.static.17k.com/book/189x272/99/19/121999.jpg-189x272?v=0",
    "http://cdn.static.17k.com/book/189x272/45/86/3038645.jpg-189x272?v=1571104852000",
    "http://cdn.static.17k.com/book/189x272/13/20/2412013.jpg-189x272?v=0",
    "http://cdn.static.17k.com/book/189x272/02/73/117302.jpg-189x272?v=1565683468000",
    "http://cdn.static.17k.com/book/189x272/87/12/471287.jpg-189x272?v=0",
    "http://cdn.static.17k.com/book/189x272/40/34/3113440.jpg-189x272?v=1584080639000"
  ];
}
</script>

<style lang="stylus" >
@import '~@/config/color'
.featured
  position relative
  display flex
  flex-direction column
  align-items center
  .banner
    width 730px
    height 220px
    overflow hidden
    z-index 1
    img
      width 730px
      height 220px
      cursor pointer
      overflow hidden
      border-radius 10px
    .el-carousel__button
      background-color $theme
    .el-carousel__arrow
      color $theme
      font-size 22px
      font-weight 700
  .tip
    display flex
    flex-direction row
    justify-content space-between
    align-content space-between
    align-items flex-end
    width 100%
    height 40px
    margin-top -15px
    margin-bottom 15px
    z-index 2
    h2
      font-size 18px
      font-weight 700
      letter-spacing 2px
    span
      color $theme
      font-weight 700
      font-size 14px
      cursor pointer
  .novel
    width 710px
    height 140px
    border-radius 10px 10px 0 10px
    display flex
    flex-direction row
    justify-content space-around
    img
      height 120px
      border-radius 10px 10px 0 10px
      overflow hidden
      cursor pointer
      transition transform 0.3s
    img:hover
      transform scale(1.1)
</style>