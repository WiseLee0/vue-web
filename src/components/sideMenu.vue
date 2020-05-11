<template>
  <div class="sideMenu"
       ref="sideMenu"
       @mouseover="openMenu"
       @mouseout="closeMenu">
    <div class="header">
      <img class="avator"
           ref="avator"
           :src="avator">
      <div class="msg"
           :style="{opacity: !isClose ? '1':'0'}">
        <span>{{user}}</span>
        <div class="unique">
          <svg class="icon"
               aria-hidden="true"
               width=18
               height=18>
            <use xlink:href="#icon-VIP"></use>
          </svg>
          <span>{{user !='Guest' ? 'mumber' : 'free'}}</span>
        </div>
      </div>
    </div>
    <div class="item">
      <svg class="icon"
           aria-hidden="true"
           width=34
           height=34>
        <use xlink:href="#icon-faxian1"></use>
      </svg>
      <span :style="{opacity: !isClose ? '1':'0'}">Discover</span>
    </div>
    <div class="item">
      <svg class="icon"
           aria-hidden="true"
           width=34
           height=34>
        <use xlink:href="#icon-xihuan"></use>
      </svg>
      <span :style="{opacity: !isClose ? '1':'0'}">Like</span>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
@Component
export default class SideMenu extends Vue {
  @Prop({
    default: "Guest"
  })
  user!: string;
  @Prop({
    type: String,
    default:
      "http://img.idol001.com/origin/2018/01/27/0b31239818b9091d4accc56d4552aa191517039772.jpg"
  })
  avator!: string;
  private isClose: boolean = true;
  openMenu() {
    if (this.isClose) this.isClose = false;
    else return;
    (this.$refs.sideMenu as any).style = "width:250px";
    (this.$refs.avator as any).style = "width:65px;height:65px;";
  }
  closeMenu() {
    if (!this.isClose) this.isClose = true;
    else return;
    (this.$refs.sideMenu as any).style = "width:66px";
    (this.$refs.avator as any).style = "width:35px;height:35px;";
  }
}
</script>

<style lang="stylus" scoped>
@import '~@/config/color'
.sideMenu
  width 66px
  background-color $color-backgroud
  border-right 2px solid $theme
  border-radius 0 15px 15px 0
  transition all 0.5s
  .header
    padding 20px 0 10px 10px
    position relative
    .avator
      width 35px
      height 35px
      border-radius 50%
      border 5px solid rgba(255, 255, 255, 0.2)
      overflow hidden
      cursor pointer
      transition all 0.3s
    .avator:hover
      box-shadow 0 0 10px 5px $theme
    .msg
      position absolute
      left 45%
      top 50%
      transform translateY(-50%)
      font-size 18px
      font-weight 700
      letter-spacing 2px
      display flex
      flex-direction column
      transition all 0.3s
      .unique
        display flex
        flex-direction row
        align-items flex-end
        margin-top 10px
        color $theme
        font-size 14px
        font-weight normal
        letter-spacing 1px
        span
          margin-left 5px
  .item
    height 60px
    width calc(100% - 15px)
    padding-left 15px
    display flex
    flex-direction row
    justify-content flex-start
    align-items center
    font-size 24px
    cursor pointer
    position relative
    transition all 0.3s
    span
      position absolute
      left 50%
      transform translateX(-50%)
      font-size 16px
      transition all 0.3s
  .item:hover
    background-color $color-backgroud-high
  .item:hover:before
    position absolute
    left 0
    top 50%
    transform translateY(-50%)
    content ''
    width 3px
    height 18px
    line-height 18px
    background #f20d0d
    border-radius 2px
</style>