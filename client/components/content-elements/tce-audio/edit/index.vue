<template>
  <div class="tce-audio">
    <div v-show="showPlaceholder">
      <div class="audio-placeholder">
        <div class="message">
          <span class="heading">Audio placeholder</span>
          <p v-if="!isFocused">Select to edit</p>
          <p v-else>Please use toolbar to enter url</p>
        </div>
      </div>
    </div>
    <div v-show="!showPlaceholder">
      <div v-if="!isFocused && !error" class="overlay">
        <div class="message">Click to preview</div>
      </div>
      <div class="audio-container">
        <aplayer
          v-if="source"
          v-show="!error"
          @error="error = 'Audio cannot be played.'"
          :music="playerOptions"
          mode="order" />
        <div v-if="error" class="error">
          <div class="message">
            <span class="icon mdi mdi-alert"></span>
            <p>Error: {{ error }}</p>
          </div>
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
    source() {
      return this.element.data.url;
    },
    playerOptions() {
      return {
        src: this.source,
        title: 'Audio Track',
        artist: ' ',
        pic: ' '
      };
    },
    showPlaceholder() {
      return !this.source;
    }
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
        return val ? this.playAudio() : this.pauseAudio();
      });
    }
  },
  components: { Aplayer }
};
</script>

<style lang="scss" scoped>
.tce-audio {
  position: relative;
  min-height: 70px;

  .aplayer {
    margin: 0;
  }

  .audio-placeholder {
    padding: 1.25rem;
    background-color: #f1f1f1;

    .message {
      .heading {
        font-size: 24px;
      }

      p {
        margin: 0;
        font-size: 18px;
      }
    }
  }

  .overlay, .error {
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
    }
  }

  .overlay {
    z-index: 3;

    .message {
      color: #008000;
      font-size: 1.8rem;
      line-height: 40px;
    }
  }

  .error {
    .message {
      color: white;

      p {
        display: inline;
      }

      .icon {
        font-size: 3rem;
        vertical-align: middle;
      }
    }
  }
}
</style>
