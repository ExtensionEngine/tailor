<template>
  <div
    :class="[columnWidth, { hovered, focused: isFocused }]"
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
        @save="save">
      </component>
    </div>
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep';
import { mapActions, mapGetters, mapMutations } from 'vuex-module';
import TeAccordion from './Accordion/Accordion';
import TeAssessment from './Assessment';
import TeBreak from './PageBreak';
import TeCarousel from './Carousel/Carousel';
import TeEmbed from './Embed';
import TeHtml from './Html';
import TeImage from './Image';
import TeModal from './Modal';
import TeTable from './Table';
import TeVideo from './Video';
import throttle from 'lodash/throttle';

const TE_TYPES = {
  BREAK: 'te-break',
  EMBED: 'te-embed',
  HTML: 'te-html',
  IMAGE: 'te-image',
  ASSESSMENT: 'te-assessment',
  VIDEO: 'te-video',
  ACCORDION: 'te-accordion',
  CAROUSEL: 'te-carousel',
  MODAL: 'te-modal',
  TABLE: 'te-table'
};

export default {
  name: 'teaching-element',
  props: {
    element: Object,
    disabled: Boolean,
    dragged: Boolean
  },
  data() {
    return { hovered: false };
  },
  computed: {
    ...mapGetters(['focusedElement'], 'editor'),
    isFocused() {
      if (!this.focusedElement) return false;
      return this.focusedElement.embedded
        ? this.focusedElement.id === this.element.id
        : this.focusedElement._cid === this.element._cid;
    },
    columnWidth() {
      const data = this.element.data;
      return data && data.width ? `col-xs-${data.width}` : 'col-xs-12';
    }
  },
  methods: {
    ...mapActions({ saveElement: 'save' }, 'tes'),
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
    TeBreak,
    TeCarousel,
    TeEmbed,
    TeHtml,
    TeImage,
    TeModal,
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
</style>
