<template>
  <div @click="onClick" class="toolbar">
    <div v-if="toolbar.type" class="toolbar-container">
      <component
        :is="getComponentName(toolbar.type)"
        :asset="toolbar.context">
      </component>
      <div v-if="showDeleteButton" class="delete-asset">
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
import GomoToolbar from './GomoToolbar';
import ImageToolbar from './ImageToolbar';
import { mapActions, mapGetters } from 'vuex-module';
import QuillToolbar from './QuillToolbar';
import VideoToolbar from './VideoToolbar';

const TOOLBAR_TYPES = {
  ASSESSMENT: 'quill-toolbar',
  IMAGE: 'image-toolbar',
  VIDEO: 'video-toolbar',
  GOMO: 'gomo-toolbar',
  TEXT: 'quill-toolbar'
};

export default {
  name: 'toolbar',
  computed: {
    ...mapGetters(['toolbar'], 'atom'),
    showDeleteButton() {
      const type = this.toolbar.type;
      return type && type !== 'ASSESSMENT';
    }
  },
  methods: {
    ...mapActions({ removeAsset: 'remove' }, 'assets'),
    getComponentName(type) {
      return TOOLBAR_TYPES[type];
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
