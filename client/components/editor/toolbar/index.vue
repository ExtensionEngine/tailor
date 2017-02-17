<template>
  <div @click="onClick" class="toolbar">
    <div class="toolbar-container">
      <image-toolbar
        v-if="isVisible('IMAGE')"
        :asset="toolbar.context">
      </image-toolbar>
      <quill-toolbar
        v-if="isVisible('TEXT')">
      </quill-toolbar>
      <video-toolbar
        v-if="isVisible('VIDEO')"
        :asset="toolbar.context">
      </video-toolbar>
      <gomo-toolbar
        v-if="isVisible('GOMO')"
        :asset="toolbar.context">
      </gomo-toolbar>
      <div v-if="toolbar.context" class="delete-asset">
        <span
          @click="removeAsset(toolbar.context)"
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
  name: 'toolbar',
  computed: {
    ...mapGetters(['toolbar'])
  },
  methods: {
    isVisible(type) {
      return this.toolbar.type === type;
    },
    ...mapActions({ removeAsset: 'remove' }, 'assets'),
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
