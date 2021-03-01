<template>
  <div class="tce-video">
    <element-placeholder
      v-if="showPlaceholder"
      :is-focused="isFocused"
      :is-disabled="isDisabled"
      name="Video component"
      icon="mdi-video-image"
      active-placeholder="Use toolbar to upload the video"
      active-icon="mdi-arrow-up" />
    <div v-else>
      <preview-overlay :show="!isDisabled && !isFocused">
        Double click to preview
      </preview-overlay>
      <div v-if="showError" class="overlay">
        <div class="message secondary--text">
          <v-icon>mdi-alert</v-icon> Error loading media!
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
import { ElementPlaceholder } from '@extensionengine/tce-components';
import { extname } from 'path';
import get from 'lodash/get';
import { PlyrueComponent as Plyrue } from 'plyrue';
import PreviewOverlay from 'tce-core/PreviewOverlay';

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
    isDragged: { type: Boolean, default: false },
    isDisabled: { type: Boolean, default: false }
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
  components: { ElementPlaceholder, Plyrue, PreviewOverlay }
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
  background: rgba(16, 16, 16, 0.85);

  .message {
    position: relative;
    top: 45%;
    font-size: 1.125rem !important;
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
</style>
