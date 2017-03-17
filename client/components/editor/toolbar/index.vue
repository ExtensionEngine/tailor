<template>
  <div @click="onClick" class="toolbar">
    <div v-if="focusedElement.type" class="toolbar-container">
      <component
        :is="getComponentName(focusedElement.type)"
        :element="focusedElement">
      </component>
      <div class="delete-element">
        <span @click="remove" class="btn btn-fab btn-danger">
          <span class="fa fa-trash"></span>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import EventBus from 'EventBus';
import EmbedToolbar from './EmbedToolbar';
import ImageToolbar from './ImageToolbar';
import { mapActions, mapGetters, mapMutations } from 'vuex-module';
import QuillToolbar from './QuillToolbar';
import VideoToolbar from './VideoToolbar';

const appChannel = EventBus.channel('app');

const TOOLBAR_TYPES = {
  IMAGE: 'image-toolbar',
  VIDEO: 'video-toolbar',
  EMBED: 'embed-toolbar',
  HTML: 'quill-toolbar'
};

export default {
  name: 'toolbar',
  computed: mapGetters(['focusedElement'], 'editor'),
  methods: {
    ...mapActions({ removeElement: 'remove' }, 'tes'),
    ...mapActions(['focusoutElement'], 'editor'),
    ...mapMutations(['focusElement'], 'editor'),
    remove() {
      const element = this.focusedElement;
      if (element.embedded) {
        appChannel.emit('deleteElement', element);
      } else {
        this.removeElement(element);
      }

      this.focusoutElement();
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
    EmbedToolbar,
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

.delete-element {
  position: absolute;
  z-index: 999;
  right: 0;
  transform: translate(-90%, -55%);
}
</style>
