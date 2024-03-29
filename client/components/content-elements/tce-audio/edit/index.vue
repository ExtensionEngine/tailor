<template>
  <div class="tce-audio">
    <element-placeholder
      v-if="showPlaceholder"
      :is-focused="isFocused"
      :is-disabled="isDisabled"
      name="Audio component"
      icon="mdi-speaker"
      active-placeholder="Use toolbar to upload the audio file"
      active-icon="mdi-arrow-up"
      class="element-placeholder" />
    <div v-show="!showPlaceholder" class="audio-container">
      <plyrue
        v-if="source"
        v-show="!error"
        :key="element.uid"
        :sources="sources"
        type="audio" />
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
import { ElementPlaceholder } from '@tailor-cms/core-components';
import get from 'lodash/get';
import { PlyrueComponent as Plyrue } from 'plyrue';

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
    sources: vm => ([{
      src: vm.source,
      title: 'Audio Track'
    }])
  },
  methods: {
    getPlayer() {
      return this.$el.querySelector('audio');
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
  components: { Plyrue, ElementPlaceholder }
};
</script>

<style lang="scss" scoped>
.tce-audio {
  position: relative;
  z-index: 999;
  display: flex;
  min-height: 4.5rem;
  align-items: center;
  justify-content: center;

  ::v-deep {
    .element-placeholder {
      padding: 0.5rem !important;
    }

    .plyr__menu__container {
      background: #fff;
    }
  }

  .audio-container {
    width: 100%;
  }

  .error {
    position: absolute;
    opacity: 0.98;
    width: 100%;
    height: 100%;
    background-color: #333;

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
