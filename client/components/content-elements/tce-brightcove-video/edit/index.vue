<template>
  <div class="tce-brightcove-video">
    <element-placeholder
      v-if="showPlaceholder"
      :is-focused="isFocused"
      :is-disabled="isDisabled"
      name="Brightcove video component"
      icon="mdi-video"
      active-placeholder="Use toolbar to set the video parameters"
      active-icon="mdi-arrow-up" />
    <div v-else>
      <preview-overlay :show="!isDisabled && !isFocused">
        Double click to preview
      </preview-overlay>
      <brightcove-player
        ref="player"
        v-bind="config"
        class="player" />
    </div>
  </div>
</template>

<script>
import BrightcovePlayer from './Player';
import { ElementPlaceholder } from 'tce-core';
import get from 'lodash/get';
import PreviewOverlay from 'tce-core/PreviewOverlay';

export default {
  name: 'tce-brightcove-video',
  props: {
    element: { type: Object, required: true },
    isFocused: { type: Boolean, default: false },
    isDisabled: { type: Boolean, default: false }
  },
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
  components: { BrightcovePlayer, ElementPlaceholder, PreviewOverlay }
};
</script>

<style lang="scss" scoped>
.tce-brightcove-video {
  position: relative;
}

.player ::v-deep .video-js .vjs-big-play-button {
  display: none;
}
</style>
