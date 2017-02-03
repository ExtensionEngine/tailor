<template>
  <div @click="onClick">
    <quill-toolbar
      v-if="isVisible('TEXT')"
      :asset="focusedAsset">
    </quill-toolbar>
    <video-toolbar
      v-if="isVisible('VIDEO')"
      :asset="focusedAsset">
    </video-toolbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex-module';
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
    QuillToolbar,
    VideoToolbar
  }
};
</script>
