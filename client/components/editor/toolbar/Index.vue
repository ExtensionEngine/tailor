<template>
  <div @click="onClick">
    <image-toolbar
      v-if="isVisible('IMAGE')"
      :asset="focusedAsset">
    </image-toolbar>
    <quill-toolbar
      v-if="isVisible('TEXT')"
      :asset="focusedAsset">
    </quill-toolbar>
    <video-toolbar
      v-if="isVisible('VIDEO')"
      :asset="focusedAsset">
    </video-toolbar>
    <gomo-toolbar
      v-if="isVisible('GOMO')"
      :asset="focusedAsset">
    </gomo-toolbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex-module';
import ImageToolbar from './ImageToolbar';
import QuillToolbar from './QuillToolbar';
import VideoToolbar from './VideoToolbar';
import GomoToolbar from './GomoToolbar';

export default {
  name: 'toolbar',
  computed: {
    ...mapGetters(['focusedAsset'], 'atom')
  },
  methods: {
    isVisible(type) {
      return this.focusedAsset && (this.focusedAsset.type === type);
    },
    onClick(e) {
      // Attach component data
      e.component = { name: 'toolbar', data: {} };
    }
  },
  components: {
    ImageToolbar,
    QuillToolbar,
    VideoToolbar,
    GomoToolbar
  }
};
</script>
