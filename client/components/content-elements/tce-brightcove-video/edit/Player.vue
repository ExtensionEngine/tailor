<template>
  <div class="brightcove-player">
    <div v-if="showError" class="error">
      <div class="message">
        <span class="mdi mdi-alert"></span>
        <p>Error loading media!</p>
      </div>
    </div>
    <div v-show="!showError" ref="videoWrapper" class="wrapper"></div>
  </div>
</template>

<script>
import join from 'url-join';

const BASE_URL = '//players.brightcove.net/';
const ERROR_NOT_FOUND = 'VIDEO_CLOUD_ERR_VIDEO_NOT_FOUND';
const ERROR_INVALID_CONFIG = 'ERR_INVALID_CONFIGURATION';

export default {
  name: 'brightcove-player',
  props: {
    accountId: { type: String, default: null },
    playerId: { type: String, default: null },
    videoId: { type: String, default: null },
    debug: { type: Boolean, default: false },
    analytics: { type: Boolean, default: false }
  },
  data() {
    return {
      error: null,
      style: null,
      script: null
    };
  },
  computed: {
    playerUrl() {
      const script = this.debug ? 'index.js' : 'index.min.js';
      return join(BASE_URL, this.accountId, `${this.playerId}_default`, script);
    },
    showError() {
      if (!this.error) return false;
      const code = this.error.code;
      return code === ERROR_NOT_FOUND || code === ERROR_INVALID_CONFIG;
    }
  },
  methods: {
    createPlayer() {
      const video = document.createElement('video');
      Object.assign(video.dataset, {
        account: this.accountId,
        player: this.playerId,
        videoId: this.videoId
      });
      video.className = 'video-js';
      video.setAttribute('controls', '');
      return video;
    },
    destroyPlayer() {
      // Dispose player.
      if (this.player) {
        this.player.pause();
        this.player.dispose();
        this.player = null;
      }
      // Clear errors.
      this.error = null;
      // Remove player assets.
      if (this.script) this.$el.removeChild(this.script);
      this.script = null;
      if (this.style) document.head.removeChild(this.style);
      this.style = null;
      // Wipe wrapper contents.
      empty(this.$refs.videoWrapper);
    },
    initPlayer(playerUrl = this.playerUrl) {
      // Cleanup previous instance.
      this.destroyPlayer();
      // Load player script.
      this.script = loadScript(playerUrl, this.$el, err => {
        if (err) {
          this.onError({
            code: ERROR_INVALID_CONFIG,
            accountId: this.accountId,
            playerId: this.playerId
          });
          return;
        }
        // Override default videojs styling.
        this.style = this.setTheme();
        // Create new video element.
        const video = this.createPlayer();
        this.$refs.videoWrapper.appendChild(video);
        // Initialize Brightcove player using bc API.
        if (!this.analytics) disableAnalytics(window.bc.videojs);
        this.player = window.bc(video);
        this.player.autoplay(false);
        this.player.on('error', () => this.onError(this.player.error()));
      });
    },
    setTheme() {
      const cls = `bc-style-${this.playerId}-default`;
      const theme = document.head.getElementsByClassName(cls)[0];
      return document.head.insertBefore(theme, null);
    },
    pause() {
      if (this.player) this.player.pause();
    },
    onError(err) {
      this.error = err;
    }
  },
  watch: {
    playerUrl() {
      if (!this.$el) return;
      this.initPlayer();
    },
    videoId() {
      if (!this.$el) return;
      this.initPlayer();
    }
  },
  mounted() {
    this.initPlayer();
  },
  beforeDestroy() {
    this.destroyPlayer();
  }
};

function disableAnalytics(videojs) {
  // Swapping `bcAnalytics` with stub developed according to:
  // http://players.brightcove.net/1752604059001/VJCJXL3Ye_default/index.js
  const registerPlugin = videojs.registerPlugin || videojs.plugin;
  registerPlugin.call(videojs, 'analyticsBlocker', function init() {
    this.bcAnalytics = { client: { getSessionId } };
  });

  function getSessionId() {
    return (Math.random() * 0xFFFFFFFF >>> 0).toString(16);
  }
}

function loadScript(url, dest, cb) {
  const script = document.createElement('script');
  script.src = url;
  script.async = false;
  script.onload = () => cb(null, script);
  script.onerror = () => cb(new Error('Error loading script!'), script);
  return dest.appendChild(script);
}

function empty(el) {
  if (el) el.innerHTML = '';
}
</script>

<style lang="scss" scoped>
.brightcove-player, .brightcove-player ::v-deep .video-js {
  width: 100%;
  height: 360px;
}

.error {
  position: relative;
  height: 100%;
  background: rgba(0,0,0,0.9);
}

.error .message {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #fff;
  font-size: 18px;
  font-weight: 500;
  .mdi { font-size: 42px; }
}

.brightcove-player ::v-deep .vjs-error .vjs-error-display::before {
  content: "\F026";
  font-size: 42px;
  font-family: $font-family-icons;
}
</style>
