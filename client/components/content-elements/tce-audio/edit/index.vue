<template>
  <div class="tce-audio">
    <v-sheet v-if="showPlaceholder" class="py-4 px-12">
      <v-avatar size="60" color="blue-grey darken-4">
        <v-icon :size="isFocused ? 38 : 30" dark>mdi-speaker</v-icon>
      </v-avatar>
      <div class="headline my-4">Audio component</div>
      <div class="subtitle-1">
        <template v-if="!isFocused">Select to edit</template>
        <template v-else>
          Use toolbar
          <v-icon size="24" color="secondary">mdi-transfer-up</v-icon>
          to upload the audio file
        </template>
      </div>
    </v-sheet>
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
import get from 'lodash/get';

export default {
  name: 'tce-audio',
  props: {
    element: { type: Object, required: true },
    isFocused: { type: Boolean, default: false }
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
  components: { Aplayer }
};
</script>

<style lang="scss" scoped>
.tce-audio {
  position: relative;
  min-height: 4.5rem;

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
