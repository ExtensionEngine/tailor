<template>
  <div @click="onClick">
    <image-toolbar
      v-if="isVisible('image')"
      :asset="focusedAsset">
    </image-toolbar>
    <quill-toolbar
      v-if="isVisible('text')"
      :asset="focusedAsset">
    </quill-toolbar>
    <video-toolbar
      v-if="isVisible('video')"
      :asset="focusedAsset">
    </video-toolbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex-module';
import ImageToolbar from './ImageToolbar';
import QuillToolbar from './QuillToolbar';
import VideoToolbar from './VideoToolbar';

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
    VideoToolbar
  }
};
</script>
