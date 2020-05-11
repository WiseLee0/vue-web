<template>
  <div class="audio">
    <audio @play="ready"
           @timeupdate="timeUpdate"
           @ended="end"
           @error="error"
           ref="audio"></audio>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { mapGetters, mapMutations, mapActions } from "vuex";
import event from "@/utils/event";
@Component({
  computed: {
    ...mapGetters(["playing", "playList", "currentIndex", "mode"])
  },
  mounted() {
    event.$emit("onReady", (this as any).isReady);
    event.$on("onInit", (url: string) => {
      this.$nextTick(() => {
        if (!(this as any).playing) (this as any).set_playing(true);
        (this.$refs.audio as any).currentTime = 0;
        (this.$refs.audio as any).src = url;
        (this.$refs.audio as any).load();
        (this.$refs.audio as any).play();
      });
    });
    event.$on("onPlay", (url: string) => {
      this.$nextTick(() => {
        (this.$refs.audio as any).play();
        (this as any).set_playing(true);
      });
    });
    event.$on("onPause", () => {
      this.$nextTick(() => {
        (this.$refs.audio as any).pause();
        (this as any).set_playing(false);
      });
    });
    event.$on("changePlayTime", (time: number) => {
      this.$nextTick(() => {
        (this.$refs.audio as any).currentTime = time;
      });
    });
  },
  methods: {
    ...mapMutations({
      set_playing: "SET_PLAYING",
      set_currentIndex: "SET_CURRENTINDEX"
    }),
    ...mapActions(["savePlayHistory"])
  }
})
export default class Audio extends Vue {
  ready() {
    const playList = (this as any).playList;
    const index = (this as any).currentIndex;
    (this as any).savePlayHistory(playList[index]);
  }
  timeUpdate(e: any) {
    event.$emit("playTime", e.target.currentTime);
  }
  end() {
    if ((this as any).mode === 1) this.loop();
    else this.next();
  }
  error() {
    console.log("song error");
  }
  /**
   * 循环播放
   */
  loop() {
    (this.$refs.audio as any).currentTime = 0;
    (this.$refs.audio as any).play();
  }
  /**
   * 下一首
   */
  next() {
    let index = (this as any).currentIndex;
    if (index == (this as any).playList.length - 1) {
      index = 0;
    } else {
      index++;
    }
    (this as any).set_currentIndex(index);
  }
}
</script>

<style lang="stylus" scoped>
.audio
  display none
</style>