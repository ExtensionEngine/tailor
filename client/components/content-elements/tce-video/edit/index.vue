<template>
  <div class="tce-video">
    <element-placeholder
      v-if="showPlaceholder"
      :is-focused="isFocused"
      name="Video"
      icon="mdi-video-image"
      active-placeholder="Use toolbar to upload the video"
      active-icon="mdi-arrow-up" />
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
        <plyrue
          v-if="showVideo"
          ref="video"
          @ready="onError"
          :emit="['error']">
          <video v-if="video.native">
            <source :src="video.url" :type="video.mime">
          </video>
          <div v-else class="plyr__video-embed">
            <iframe :src="url" allowfullscreen></iframe>
          </div>
        </plyrue>
      </div>
    </div>
  </div>
</template>

<script>
import { ElementPlaceholder } from 'tce-core';
import { extname } from 'path';
import get from 'lodash/get';
import { PlyrueComponent as Plyrue } from 'plyrue';

const { MEDIA_ERR_SRC_NOT_SUPPORTED } = window.MediaError;

const MIMETYPE = {
  m4v: 'video/mp4',
  ogv: 'video/ogg'
};

const VIDEO_HOSTING = [
  /youtu(?:\.be|be\.com)$/,
  /vimeo\.com$/,
  /drive\.google\.com$/
];

export default {
  name: 'tce-video',
  inject: ['$elementBus'],
  props: {
    element: { type: Object, required: true },
    isFocused: { type: Boolean, default: false },
    isDragged: { type: Boolean, default: false }
  },
  data: () => ({ error: null, switchingVideo: false }),
  computed: {
    player: ({ $refs }) => get($refs, 'video.player'),
    url: ({ element }) => get(element, 'data.url', ''),
    video: ({ url }) => {
      url = new URL(url);
      return {
        url: url.href,
        native: !isShareLink(url),
        ...!isShareLink(url) && { mime: mimetype(url) }
      };
    },
    showPlaceholder: ({ url }) => !url,
    showVideo: ({ switchingVideo, isDragged }) => !(switchingVideo || isDragged),
    showError: ({ error }) => error ? error.code === MEDIA_ERR_SRC_NOT_SUPPORTED : false
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
  components: { ElementPlaceholder, Plyrue }
};

function isShareLink({ hostname }) {
  return VIDEO_HOSTING.some(re => re.test(hostname));
}
function mimetype({ pathname }) {
  const ext = extname(pathname).replace(/^\./, '');
  if (MIMETYPE[ext]) return MIMETYPE[ext];
  return `video/${ext}`;
}
</script>

<style lang="scss" scoped>
.tce-video {
  position: relative;
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
    color: #d81a60;
    font-size: 1.375rem;
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
  font-size: 1.125rem;
  font-weight: 500;

  .icon {
    font-size: 2.625rem;
  }
}

.player {
  height: 25.625rem;
  background: #000;

  ::v-deep {
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
