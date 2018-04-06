<template>
  <div class="te-audio">
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
          v-show="!error"
          :music="mediaOptions"
          mode="order"/>

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

export default {
  name: 'te-audio',
  props: {
    element: { type: Object, required: true },
    isFocused: { type: Boolean, default: false }
  },
  data() {
    return {
      error: null
    };
  },
  computed: {
    mediaOptions() {
      return {
        src: this.source || ' ',
        title: 'Audio Track',
        artist: ' ',
        pic: ' '
      };
    },
    player() {
      return this.$el.querySelector('audio');
    },
    source() {
      return this.element.data.url;
    },
    showPlaceholder() {
      return !this.source;
    }
  },
  methods: {
    playAudio() {
      this.player.play()
        .catch(this.checkError);
    },
    pauseAudio() {
      this.player.pause();
    },
    checkError() {
      const { error } = this.player;
      this.error = error.message || 'Audio cannot be played.';
    }
  },
  watch: {
    isFocused() {
      if (this.isFocused) {
        return this.playAudio();
      }
      return this.pauseAudio();
    },
    'element.data.url'() {
      this.checkError();
    }
  },
  mounted() {
    this.player.onerror = this.checkError;
  },
  components: {
    Aplayer
  }
};
</script>

<style lang="scss">
.te-audio {
  position: relative;
  min-height: 70px;

  .aplayer {
    margin: 0;
  }

  .audio-placeholder {
    padding-top: 1rem;

    .message {
      .heading {
        font-size: 1.8rem;
      }

      p {
        margin: 0; // override bootswatch bottom margin
        font-size: 1.4rem;
      }
    }
  }

  .overlay, .error {
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: #333;
    opacity: .98;

    .message {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }
  }

  .overlay {
    z-index: 3;

    .message {
      color: #008000;
      line-height: 40px;
      font-size: 1.8rem;
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
