<template>
  <div class="tce-video">
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
      <div v-if="!isFocused" class="overlay">
        <div class="message">Double click to preview</div>
      </div>
      <div v-if="showError" class="error">
        <div class="message">
          <span class="icon mdi mdi-alert"></span>
          <p>Error loading media!</p>
        </div>
      </div>
      <div class="player">
        <plyr
          v-if="showVideo"
          ref="video"
          @ready="onError"
          :emit="['error']">
          <video v-if="type.isNative">
            <source :src="url" :type="type.name">
          </video>
          <div v-else class="plyr__video-embed">
            <iframe :src="url" allowfullscreen></iframe>
          </div>
        </plyr>
      </div>
    </div>
  </div>
</template>

<script>
import { extname } from 'path';
import get from 'lodash/get';
import { Plyr } from 'vue-plyr';

handlePlyrErrors(Plyr);

const MediaError = window.MediaError;

const NOT_NATIVE = /youtu\.?be|vimeo/;

// NOTE: m4v is a special video file format used by Apple. It is a video in
//       mp4 container and uses a `.m4v` extension. Can contain DRM.
// https://stackoverflow.com/a/15279480
const CUSTOM_SUBTYPE_MAPPING = {
  ogv: 'ogg',
  m4v: 'mp4'
};

export default {
  name: 'tce-video',
  inject: ['$elementBus'],
  props: {
    element: { type: Object, required: true },
    isFocused: { type: Boolean, default: false },
    isDragged: { type: Boolean, default: false }
  },
  data() {
    return {
      error: null,
      switchingVideo: false
    };
  },
  computed: {
    player() {
      return get(this.$refs, 'video.player');
    },
    url() {
      return get(this.element, 'data.url', '');
    },
    type() {
      if (NOT_NATIVE.test(this.url)) return { isNative: false };
      const url = this.url.split('?').shift();
      const ext = extname(url).substring(1);
      const name = `video/${CUSTOM_SUBTYPE_MAPPING[ext] || ext}`;
      return { isNative: true, name };
    },
    showPlaceholder() {
      return !this.url;
    },
    showVideo() {
      return !(this.switchingVideo || this.isDragged);
    },
    showError() {
      if (!this.error) return false;
      return this.error.code === MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED;
    }
  },
  methods: {
    onError(err) {
      this.error = err;
    }
  },
  watch: {
    isFocused(val, oldVal) {
      if (oldVal && !val && this.player) this.player.pause();
    },
    url() {
      this.switchingVideo = true;
      this.$nextTick(() => (this.switchingVideo = false));
    }
  },
  beforeDestroy() {
    if (this.player) this.player.pause();
  },
  mounted() {
    this.$elementBus.on('save', ({ data }) => this.$emit('save', data));
  },
  components: { Plyr }
};

// Workaround for https://github.com/sampotts/plyr/issues/1001
const ytDestroyError = 'The YouTube player is not attached to the DOM.';
function handlePlyrErrors(Plyr) {
  const beforeDestroy = Plyr.beforeDestroy;
  Plyr.beforeDestroy = function () {
    try {
      return beforeDestroy.call(this, arguments);
    } catch (err) {
      if (err.message !== ytDestroyError) throw err;
    }
  };
}
</script>

<style lang="scss" scoped>
.tce-video {
  position: relative;
}

.video-placeholder {
  .message {
    padding: 155px 20px;

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
  z-index: 3;
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

.error {
  position: absolute;
  z-index: 98;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.9);
}

.error .message {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #fff;
  font-size: 18px;
  font-weight: 500;

  .icon {
    font-size: 42px;
  }
}

.well {
  margin: 0;
}

.player {
  height: 410px;
  background: #000;

  /deep/ {
    > div, .plyr--video, .plyr__video-wrapper, video {
      height: 100%;
    }

    .plyr.plyr--vimeo:fullscreen {
      padding-bottom: 56.25%;
    }

    .plyr__video-wrapper {
      padding-bottom: 0 !important;
    }

    .plyr__control--overlaid {
      display: none;
    }
  }
}

.disabled .overlay {
  display: none;
}
</style>
