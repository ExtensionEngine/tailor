<template>
  <div>
    <video-player :options="options"></video-player>
  </div>
</template>

<script>
import { videoPlayer } from 'vue-video-player';

export default {
  name: 'video-asset',
  props: ['asset', 'isFocused'],
  data() {
    return {
      options: {
        source: {
          type: 'video/webm',
          src: 'https://cdn.theguardian.tv/webM/2015/07/20/150716YesMen_synd_768k_vp8.webm'
        }
      }
    };
  },
  components: {
    videoPlayer
  }
};
</script>
