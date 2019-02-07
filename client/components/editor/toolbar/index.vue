<template>
  <div class="toolbar">
    <div v-if="elementSelected" class="toolbar-container">
      <component
        :is="getComponentName(focusedElement.type)"
        :key="focusedElement._cid || focusedElement.id"
        :element="focusedElement">
      </component>
      <div class="delete-element">
        <slot name="actions"></slot>
        <span @click="requestDeleteConfirmation" class="btn btn-fab btn-danger">
          <span class="mdi mdi-delete"></span>
        </span>
      </div>
    </div>
    <div v-else class="toolbar-container editor-toolbar">
      <router-link
        :to="{ name: 'course', params: { courseId } }"
        class="toolbar-btn">
        <span class="mdi mdi-arrow-left"></span>
      </router-link>
      <a
        v-tooltip="'Preview in LMS'"
        v-if="previewUrl"
        :href="previewUrl"
        class="toolbar-btn btn-alt"
        target="_blank">
        <span class="mdi mdi-eye"></span>
      </a>
      <div
        v-tooltip="`${publishTooltip}`"
        :class="{ disabled: publishing }"
        @click="publishActivity"
        class="toolbar-btn btn-alt">
        <span class="mdi mdi-publish"></span>
      </div>
      <div v-if="activity" class="editor-heading">
        <h1 :style="{ 'margin-top': breadcrumbs.length ? '1px' : '9px' }">
          {{ activity.data.name }}
        </h1>
        <div class="breadcrumbs">
          <span v-for="(item, index) in breadcrumbs" :key="item.id">
            {{ truncate(item.data.name, breadcrumbs.length > 2 ? 40 : 80) }}
            <span v-if="index !== (breadcrumbs.length - 1)"> / </span>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AccordionToolbar from './AccordionToolbar';
import AudioToolbar from './AudioToolbar';
import BrightcoveVideoToolbar from './BrightcoveVideoToolbar';
import CarouselToolbar from './CarouselToolbar';
import DefaultToolbar from './DefaultToolbar';
import drop from 'lodash/drop';
import EventBus from 'EventBus';
import EmbedToolbar from './EmbedToolbar';
import fecha from 'fecha';
import find from 'lodash/find';
import format from 'string-template';
import get from 'lodash/get';
import ImageToolbar from './ImageToolbar';
import { mapActions, mapGetters, mapMutations } from 'vuex-module';
import ModalToolbar from './ModalToolbar';
import PdfToolbar from './PdfToolbar';
import QuillToolbar from './QuillToolbar';
import TableToolbar from './TableToolbar';
import truncate from 'truncate';
import VideoToolbar from './VideoToolbar';

const PREVIEW_URL = process.env.PREVIEW_URL;
const appChannel = EventBus.channel('app');

const TOOLBAR_TYPES = {
  IMAGE: 'image-toolbar',
  VIDEO: 'video-toolbar',
  BRIGHTCOVE_VIDEO: 'brightcove-video-toolbar',
  EMBED: 'embed-toolbar',
  HTML: 'quill-toolbar',
  ACCORDION: 'accordion-toolbar',
  CAROUSEL: 'carousel-toolbar',
  MODAL: 'modal-toolbar',
  TABLE: 'table-toolbar',
  PDF: 'pdf-toolbar',
  AUDIO: 'audio-toolbar',
  'TABLE-CELL': 'table-toolbar'
};

export default {
  name: 'toolbar',
  data() {
    return { publishing: false };
  },
  computed: {
    ...mapGetters(['focusedElement', 'activity'], 'editor'),
    ...mapGetters(['tes', 'activities']),
    courseId() {
      return get(this.activity, 'courseId');
    },
    publishTooltip() {
      if (!this.activity) return;
      const name = get(this.activity, 'data.name', '');
      const { publishedAt } = this.activity;
      const status = publishedAt
        ? `Published on ${fecha.format(new Date(publishedAt), 'M/D/YY HH:mm')}`
        : '';
      return `Publish '${truncate(name, 30)}'. ${status}`;
    },
    elementSelected() {
      return get(this, 'focusedElement.type');
    },
    previewUrl() {
      if (!PREVIEW_URL) return;
      const { courseId, activityId } = this.$route.params;
      return format(PREVIEW_URL, { repositoryId: courseId, activityId });
    },
    breadcrumbs() {
      let items = [];
      let item = this.activity;
      while (item) {
        item = find(this.activities, { id: item.parentId });
        if (item) items.unshift(item);
      }
      return items.length > 3 ? drop(items, items.length - 3) : items;
    }
  },
  methods: {
    ...mapActions(['publish'], 'activities'),
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
    publishActivity() {
      this.publishing = true;
      this.publish(this.activity).then(() => (this.publishing = false));
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
    },
    truncate(str, len = 50) {
      return truncate(str, len);
    }
  },
  components: {
    AccordionToolbar,
    AudioToolbar,
    BrightcoveVideoToolbar,
    CarouselToolbar,
    DefaultToolbar,
    EmbedToolbar,
    ImageToolbar,
    ModalToolbar,
    PdfToolbar,
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
  transform: translate(-30%, -55%);

  .btn {
    font-size: 26px;
    line-height: 48px;
    vertical-align: middle;
  }

  .btn-primary {
    margin-right: 8px;
  }
}

.editor-toolbar {
  display: flex;
  height: 52px;
  background-color: white;
  box-shadow:
    0 2px 2px 0 rgba(0, 0, 0, 0.14),
    0 1px 5px 0 rgba(0, 0, 0, 0.12),
    0 3px 1px -2px rgba(0, 0, 0, 0.2);

  .editor-heading {
    flex: 1;
    min-width: 0;
    padding: 10px 30px 0 20px;
  }

  h1 {
    width: 100%;
    margin: 0 0 1px;
    color: #555;
    font-size: 18px;
    text-align: left;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }

  .breadcrumbs {
    display: inline-block;
    width: 100%;
    font-size: 12px;
    text-align: left;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
}

.toolbar-btn {
  flex-basis: 0;
  color: white;
  background-color: #144acc;
  box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
  cursor: pointer;

  &:hover {
    background-color: darken(#144acc, 10%);
  }

  .mdi {
    display: inline-block;
    padding: 4px 20px 1px;
    font-size: 30px;
  }
}

.toolbar-btn.btn-alt {
  background-color: #2f73e9;

  &:hover {
    background-color: darken(#2f73e9, 10%);
  }
}

.toolbar-btn.disabled {
  pointer-events: none;
  opacity: 0.89;
}
</style>
