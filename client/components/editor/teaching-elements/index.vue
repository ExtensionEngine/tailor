<template>
  <div
    :class="[columnClass, { disabled, hovered, focused: isFocused }]"
    @mouseover="hovered = true"
    @mouseleave="hovered = false"
    @dragstart="$emit('dragstart')"
    @dragend="$emit('dragend')"
    @dragover="scrollContainer"
    class="te-container">
    <div @click="focus" class="teaching-element">
      <span class="drag-handle">
        <span class="mdi mdi-drag-vertical"></span>
      </span>
      <component
        :is="resolveElement(element.type)"
        :element="element"
        :isFocused="isFocused"
        :isDragged="dragged"
        :disabled="disabled"
        @remove="removeElement(element)"
        @save="save">
      </component>
    </div>
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep';
import get from 'lodash/get';
import { mapActions, mapGetters, mapMutations } from 'vuex-module';
import TeAccordion from './Accordion/Accordion';
import TeAssessment from './Assessment';
import TeAudio from './Audio';
import TeBreak from './PageBreak';
import TeBrightcoveVideo from './BrightcoveVideo';
import TeCarousel from './Carousel/Carousel';
import TeEmbed from './Embed';
import TeHtml from './Html';
import TeImage from './Image';
import TeModal from './Modal';
import TePdf from './Pdf';
import TePoll from './Poll';
import TeTable from './Table';
import TeVideo from './Video';
import throttle from 'lodash/throttle';

const TE_TYPES = {
  BREAK: 'te-break',
  BRIGHTCOVE_VIDEO: 'te-brightcove-video',
  EMBED: 'te-embed',
  HTML: 'te-html',
  IMAGE: 'te-image',
  ASSESSMENT: 'te-assessment',
  VIDEO: 'te-video',
  ACCORDION: 'te-accordion',
  CAROUSEL: 'te-carousel',
  MODAL: 'te-modal',
  PDF: 'te-pdf',
  AUDIO: 'te-audio',
  TABLE: 'te-table',
  POLL: 'te-poll'
};

export default {
  name: 'teaching-element',
  props: {
    element: { type: Object, required: true },
    disabled: { type: Boolean, default: false },
    // Set `setWidth` to false to control element width externally
    setWidth: { type: Boolean, default: true },
    dragged: { type: Boolean, default: false }
  },
  data() {
    return { hovered: false };
  },
  computed: {
    ...mapGetters(['focusedElement'], 'editor'),
    isFocused() {
      if (this.disabled || !this.focusedElement) return false;
      return this.focusedElement.embedded
        ? this.focusedElement.id === this.element.id
        : this.focusedElement._cid === this.element._cid;
    },
    columnClass() {
      if (!this.setWidth) return '';
      const width = get(this.element.data, 'width');
      return width ? `col-xs-${width}` : 'col-xs-12';
    }
  },
  methods: {
    ...mapActions({ saveElement: 'save', removeElement: 'remove' }, 'tes'),
    ...mapMutations(['focusElement'], 'editor'),
    resolveElement(type) {
      return TE_TYPES[type];
    },
    focus(e) {
      if (this.disabled || e.component) return;
      this.focusElement(this.element);
      // Attach component meta
      e.component = { name: 'teaching-element', data: this.element };
    },
    save(elementData) {
      if (this.element.embedded) {
        let data = cloneDeep(this.element.data);
        Object.assign(data, elementData);
        this.$emit('save', { ...this.element, data });
      } else {
        Object.assign(this.element.data, elementData);
        this.saveElement(this.element);
      }
    },
    scrollContainer: throttle(function (e) {
      const scrollUp = e.y < 200;
      const scrollDown = e.y > (window.innerHeight - 200);
      if (scrollUp || scrollDown) {
        window.scrollBy(0, scrollUp ? -30 : 30);
      }
    }, 20)
  },
  components: {
    TeAccordion,
    TeAssessment,
    TeAudio,
    TeBreak,
    TeBrightcoveVideo,
    TeCarousel,
    TeEmbed,
    TeHtml,
    TeImage,
    TeModal,
    TePdf,
    TePoll,
    TeTable,
    TeVideo
  }
};
</script>

<style lang="scss" scoped>
.drag-handle {
  position: absolute;
  top: 0;
  left: -3px;
  z-index: 2;
  width: 26px;
  opacity: 0;

  .mdi {
    color: #888;
    font-size: 28px;
  }
}

.hovered {
  .drag-handle {
    opacity: 1;
    transition: opacity 0.6s ease-in-out;
    cursor: pointer;
  }
}

.te-container {
  padding: 7px 0;
}

.teaching-element {
  position: relative;
  padding: 10px 20px;
  border: 1px dotted #ccc;
}

.focused {
  > .teaching-element {
    border: 1px solid #90a4ae;
    box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.15);
  }
}

.disabled .drag-handle {
  display: none;
}
</style>
