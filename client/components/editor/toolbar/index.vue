<template>
  <div @click="onClick" class="toolbar">
    <div class="toolbar-container">
      <image-toolbar
        v-if="isFocused('IMAGE')"
        :asset="focusedAsset">
      </image-toolbar>
      <quill-toolbar
        v-if="isFocused('TEXT')"
        :asset="focusedAsset">
      </quill-toolbar>
      <video-toolbar
        v-if="isFocused('VIDEO')"
        :asset="focusedAsset">
      </video-toolbar>
      <gomo-toolbar
        v-if="isFocused('GOMO')"
        :asset="focusedAsset">
      </gomo-toolbar>
      <div v-if="focusedAsset" class="delete-asset">
        <span
          @click="removeAsset(focusedAsset)"
          class="btn btn-fab btn-danger">
          <span class="fa fa-trash"></span>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex-module';
import ImageToolbar from './ImageToolbar';
import GomoToolbar from './GomoToolbar';
import QuillToolbar from './QuillToolbar';
import VideoToolbar from './VideoToolbar';

export default {
  computed: mapGetters(['focusedAsset'], 'atom'),
  methods: {
    ...mapActions({ removeAsset: 'remove' }, 'assets'),
    isFocused(type) {
      return this.focusedAsset && (this.focusedAsset.type === type);
    },
    onClick(e) {
      // Attach component data
      e.component = { name: 'toolbar', data: {} };
    }
  },
  components: {
    ImageToolbar,
    GomoToolbar,
    QuillToolbar,
    VideoToolbar
  }
};
</script>

<style lang="scss" scoped>
.toolbar {
  position: fixed;
  width: 100%;
  z-index: 999;
}

.toolbar-container {
  position: relative;
}

.delete-asset {
  position: absolute;
  z-index: 999;
  right: 0;
  transform: translate(-90%, -55%);
}
</style>
