<template>
  <div class="video-asset">
    <div v-if="showPlaceholder">
      <div class="well video-placeholder">
        <div class="message">
          <span class="heading">Video placeholder</span>
          <span v-if="!isFocused">Select to edit</span>
          <span v-else>Please use toolbar to enter url</span>
        </div>
      </div>
    </div>
    <div v-else>
      <div class="overlay" v-if="!isFocused">
        <div class="message">Double click to preview</div>
      </div>
      <video-player
        ref="video"
        :options="options">
      </video-player>
    </div>
  </div>
</template>

<script>
import { videoPlayer } from 'vue-video-player';

export default {
  name: 'video-asset',
  props: ['asset', 'isFocused'],
  computed: {
    player() {
      return this.$refs.video && this.$refs.video.player;
    },
    options() {
      return {
        autoplay: false,
        source: { src: this.asset.data.url }
      };
    },
    showPlaceholder() {
      return !this.asset.data.url;
    }
  },
  watch: {
    isFocused(val, oldVal) {
      if (oldVal && !val) if (this.player) this.player.pause();
    }
  },
  components: {
    videoPlayer
  }
};
</script>

<style lang="scss" scoped>
.video-asset {
  position: relative;
}

.video-placeholder {
  .message {
    padding: 100px;

    .heading {
      font-size: 24px;
    }

    span {
      display: block;
      font-size: 18px;
    }
  }
}

.overlay {
  position: absolute;
  z-index: 99;
  width: 100%;
  height: 100%;
  background-color: #333;
  opacity: 0.9;

  .message {
    position: relative;
    top: 45%;
    color: green;
    font-size: 22px;
  }
}

.well {
  margin: 0;
}
</style>

<style lang="scss">
.video-asset .vjs-big-play-button {
  display: none !important;
}
</style>
