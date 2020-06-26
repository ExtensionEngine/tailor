<template>
  <div class="tce-audio">
    <element-placeholder
      v-if="showPlaceholder"
      :is-focused="isFocused"
      :is-disabled="isDisabled"
      name="Audio"
      icon="mdi-speaker"
      active-placeholder="Use toolbar to upload the audio file"
      active-icon="mdi-arrow-up"
      class="element-placeholder" />
    <div v-show="!showPlaceholder" class="audio-container">
      <aplayer
        v-if="source"
        v-show="!error"
        @error="error = 'Audio cannot be played.'"
        :music="playerOptions"
        mode="order" />
      <div v-if="error" class="error">
        <div class="message">
          <v-icon dark class="mr-2">mdi-alert</v-icon>
          {{ error }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Aplayer from 'vue-aplayer';
import { ElementPlaceholder } from 'tce-core';
import get from 'lodash/get';

export default {
  name: 'tce-audio',
  props: {
    element: { type: Object, required: true },
    isFocused: { type: Boolean, default: false },
    isDisabled: { type: Boolean, default: false }
  },
  data() {
    return { error: null };
  },
  computed: {
    source: vm => vm.element.data.url,
    showPlaceholder: vm => !vm.source,
    playerOptions: vm => ({
      src: vm.source,
      title: 'Audio Track',
      artist: ' ',
      pic: ' '
    })
  },
  methods: {
    getPlayer() {
      return this.$el.querySelector('audio');
    },
    playAudio() {
      this.getPlayer().play();
    },
    pauseAudio() {
      this.getPlayer().pause();
    },
    checkError() {
      this.$nextTick(() => {
        const player = this.getPlayer();
        if (!player || !player.error) return;
        this.error = get(player, 'error.message', 'Audio cannot be played.');
      });
    }
  },
  watch: {
    source(val) {
      this.error = null;
      this.checkError();
    },
    isFocused(val) {
      this.$nextTick(() => {
        if (!this.getPlayer()) return;
        if (!val) this.pauseAudio();
      });
    }
  },
  components: { Aplayer, ElementPlaceholder }
};
</script>

<style lang="scss" scoped>
.tce-audio {
  position: relative;
  min-height: 4.5rem;

  ::v-deep .element-placeholder {
    padding: 0.5rem !important;
  }

  .aplayer {
    margin: 0;
  }

  .error {
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: #333;
    opacity: 0.98;

    .message {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: #fff;
    }
  }
}
</style>
