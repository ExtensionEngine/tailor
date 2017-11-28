<template>
  <div class="toolbar">
    <div v-if="elementSelected" class="toolbar-container">
      <component
        :is="getComponentName(focusedElement.type)"
        :key="focusedElement._cid || focusedElement.id"
        :element="focusedElement">
      </component>
      <div class="delete-element">
        <span @click="requestDeleteConfirmation" class="btn btn-fab btn-danger">
          <span class="mdi mdi-delete"></span>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import AccordionToolbar from './AccordionToolbar';
import CarouselToolbar from './CarouselToolbar';
import DefaultToolbar from './DefaultToolbar';
import EventBus from 'EventBus';
import EmbedToolbar from './EmbedToolbar';
import find from 'lodash/find';
import get from 'lodash/get';
import ImageToolbar from './ImageToolbar';
import { mapActions, mapGetters, mapMutations } from 'vuex-module';
import ModalToolbar from './ModalToolbar';
import QuillToolbar from './QuillToolbar';
import TableToolbar from './TableToolbar';
import VideoToolbar from './VideoToolbar';

const appChannel = EventBus.channel('app');

const TOOLBAR_TYPES = {
  IMAGE: 'image-toolbar',
  VIDEO: 'video-toolbar',
  EMBED: 'embed-toolbar',
  HTML: 'quill-toolbar',
  ACCORDION: 'accordion-toolbar',
  CAROUSEL: 'carousel-toolbar',
  MODAL: 'modal-toolbar',
  TABLE: 'table-toolbar',
  'TABLE-CELL': 'table-toolbar'
};

export default {
  name: 'toolbar',
  computed: {
    ...mapGetters(['focusedElement'], 'editor'),
    ...mapGetters(['tes']),
    elementSelected() {
      return get(this, 'focusedElement.type');
    }
  },
  methods: {
    ...mapActions({ removeElement: 'remove' }, 'tes'),
    ...mapActions(['focusoutElement'], 'editor'),
    ...mapMutations(['focusElement'], 'editor'),
    remove(element) {
      // Special case the deletion of tables, so it's possible to delete them
      // from cells as well
      if (element.type === 'TABLE-CELL') {
        const tableElement = find(this.tes, te => !!get(te, `data.embeds.${element.id}`));
        this.removeElement(tableElement);
        this.focusoutElement();
        return;
      }

      if (element.embedded) {
        appChannel.emit('deleteElement', element);
      } else {
        this.removeElement(element);
      }

      this.focusoutElement();
    },
    requestDeleteConfirmation() {
      appChannel.emit('showConfirmationModal', {
        type: 'element',
        item: this.focusedElement,
        action: () => this.remove(this.focusedElement)
      });
    },
    getComponentName(type) {
      return TOOLBAR_TYPES[type] || 'default-toolbar';
    }
  },
  components: {
    AccordionToolbar,
    CarouselToolbar,
    DefaultToolbar,
    EmbedToolbar,
    ImageToolbar,
    ModalToolbar,
    QuillToolbar,
    TableToolbar,
    VideoToolbar
  }
};
</script>

<style lang="scss" scoped>
.toolbar-container {
  position: absolute;
  width: 100%;
  z-index: 999;
}

.delete-element {
  position: absolute;
  z-index: 999;
  right: 0;
  transform: translate(-90%, -55%);

  .btn {
    font-size: 26px;
    line-height: 48px;
    vertical-align: middle;
  }
}
</style>
