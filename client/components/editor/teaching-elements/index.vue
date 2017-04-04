<template>
  <div
    :class="[columnWidth, { hovered, focused: isFocused }]"
    @mouseover="hovered = true"
    @mouseleave="hovered = false"
    class="te-container">
    <div @click="focus" class="teaching-element">
      <span class="drag-handle">
        <span class="mdi mdi-drag-vertical"></span>
      </span>
      <component
        :is="resolveElement(element.type)"
        :element="element"
        :isFocused="isFocused"
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
import TeEmbed from './Embed';
import TeHtml from './Html';
import TeImage from './Image';
import TeVideo from './Video';

const TE_TYPES = {
  BREAK: 'te-break',
  EMBED: 'te-embed',
  HTML: 'te-html',
  IMAGE: 'te-image',
  ASSESSMENT: 'te-assessment',
  VIDEO: 'te-video',
  ACCORDION: 'te-accordion'
};

export default {
  name: 'teaching-element',
  props: {
    element: Object,
    disabled: Boolean
  },
  data() {
    return {
      hovered: false
    };
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
    ...mapActions({ updateElement: 'update' }, 'tes'),
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
        this.updateElement(this.element);
      }
    }
  },
  components: {
    TeAccordion,
    TeAssessment,
    TeBreak,
    TeEmbed,
    TeHtml,
    TeImage,
    TeVideo
  }
};
</script>

<style lang="scss" scoped>
.drag-handle {
  position: absolute;
  top: 0px;
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
    transition: opacity .6s ease-in-out;
    cursor: pointer;
  }
}

.te-container {
  padding: 7px 0;
  user-select: none;

  &.focused {
    user-select: unset;
  }
}

.teaching-element {
  position: relative;
  padding: 10px 20px 10px 20px;
  border: 1px dashed #ccc;
  user-select: none;

  .focused & {
    user-select: unset;
  }
}

</style>
