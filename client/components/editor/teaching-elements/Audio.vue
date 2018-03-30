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
      <div v-if="!isFocused && !hasError" class="overlay">
        <div class="message">Click to preview</div>
      </div>
      <div class="audio-container">
        <audio
          v-show="!hasError"
          :src="source"
          controls
        >
          This browser does not support HTML5 audio element.
        </audio>
        <div v-if="hasError" class="error">
          <div class="message">
            <span class="icon mdi mdi-alert"></span>
            <p>Error loading audio file!</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'te-audio',
  props: {
    element: { type: Object, required: true },
    isFocused: { type: Boolean, default: false }
  },
  data() {
    return {
      hasError: false
    };
  },
  computed: {
    audioElement() {
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
      this.audioElement.play();
    },
    pauseAudio() {
      this.audioElement.pause();
    },
    checkError() {
      const { error } = this.audioElement;
      this.hasError = !!error;
    }
  },
  watch: {
    isFocused() {
      if (this.isFocused) {
        return this.playAudio();
      }
      return this.pauseAudio();
    },
    source() {
      this.checkError();
    }
  },
  mounted() {
    this.checkError();
  }
};
</script>

<style lang="scss">
.te-audio {
  position: relative;
  min-height: 50px;

  .audio-placeholder {
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

  audio {
    width: 100%;
    // height: 100%;
  }

  .overlay {
    position: absolute;
    z-index: 3;
    width: 100%;
    background-color: #333;
    opacity: 0.9;

    .message {
      position: relative;
      color: #008000;
      line-height: 40px;
      font-size: 1.8rem;
    }
  }

  .error {
    position: absolute;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,.9);

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
