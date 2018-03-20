<template>
  <div class="te-brightcove-video">
    <div v-if="showPlaceholder">
      <div class="well video-placeholder">
        <div class="message">
          <span class="heading">Video placeholder</span>
          <span v-if="!isFocused">Select to edit</span>
          <span v-else>Please use toolbar to change video parameters</span>
        </div>
      </div>
    </div>
    <div v-else>
      <div v-if="!isFocused" class="overlay">
        <div class="message">Double click to preview</div>
      </div>
      <brightcove-player
        v-bind="config"
        ref="player"
        class="player">
      </brightcove-player>
    </div>
  </div>
</template>

<script>
import BrightcovePlayer from './Player';
import get from 'lodash/get';

export default {
  name: 'te-brightcove-video',
  props: ['element', 'isFocused'],
  computed: {
    showPlaceholder() {
      const config = this.config;
      return !(config.accountId && config.playerId && config.videoId);
    },
    config() {
      return get(this.element, 'data', {});
    }
  },
  watch: {
    isFocused(val, oldVal) {
      if (oldVal && !val && this.$refs.player) this.$refs.player.pause();
    }
  },
  components: { BrightcovePlayer }
};
</script>

<style lang="scss" scoped>
.te-brightcove-video {
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

.player /deep/ .video-js .vjs-big-play-button {
  display: none;
}
</style>
