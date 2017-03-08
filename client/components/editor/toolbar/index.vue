<template>
  <div @click="onClick" class="toolbar">
    <div v-if="toolbar.type" class="toolbar-container">
      <component
        :is="getComponentName(toolbar.type)"
        :asset="toolbar.context">
      </component>
      <div class="delete-asset">
        <span @click="remove" class="btn btn-fab btn-danger">
          <span class="fa fa-trash"></span>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import EventBus from 'EventBus';
import GomoToolbar from './GomoToolbar';
import ImageToolbar from './ImageToolbar';
import { mapActions, mapGetters, mapMutations } from 'vuex-module';
import QuillToolbar from './QuillToolbar';
import VideoToolbar from './VideoToolbar';

const appChannel = EventBus.channel('app');

const TOOLBAR_TYPES = {
  ASSESSMENT: 'quill-toolbar',
  IMAGE: 'image-toolbar',
  VIDEO: 'video-toolbar',
  GOMO: 'gomo-toolbar',
  TEXT: 'quill-toolbar'
};

export default {
  name: 'toolbar',
  computed: mapGetters(['toolbar'], 'atom'),
  methods: {
    ...mapActions({ removeAsset: 'remove' }, 'assets'),
    ...mapMutations(['setToolbarContext'], 'atom'),
    remove() {
      const asset = this.toolbar.context;
      if (asset.embed) {
        appChannel.emit('deleteAsset', asset);
      } else {
        this.removeAsset(asset);
      }

      this.setToolbarContext();
    },
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
