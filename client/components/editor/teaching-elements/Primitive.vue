<template>
  <div
    :class="[columnWidth, elementClass]"
    @mouseover="hovered = true"
    @mouseleave="hovered = false"
    class="te-container">
    <div @click="focus" class="teaching-element">
      <span v-if="isDraggable" class="drag-handle">
        <span class="mdi mdi-drag-vertical"></span>
      </span>
      <component
        :is="resolveElement(element.type)"
        :element="initialElement"
        :isFocused="isFocused"
        @save="save">
      </component>
    </div>
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep';
import get from 'lodash/get';
import { mapActions, mapGetters, mapMutations } from 'vuex-module';
import TeHtml from './Html';
import TeImage from './Image';

const TE_TYPES = {
  HTML: 'te-html',
  IMAGE: 'te-image'
};

export default {
  name: 'te-primitive',
  props: {
    initialElement: Object,
    disabled: Boolean,
    drag: Boolean
  },
  data() {
    return {
      element: cloneDeep(this.initialElement),
      hovered: false
    };
  },
  computed: {
    ...mapGetters(['focusedElement'], 'editor'),
    isFocused() {
      if (!get(this.focusedElement, 'type')) return false;
      return this.focusedElement.embedded
        ? this.focusedElement.id === this.element.id
        : this.focusedElement._cid === this.element._cid;
    },
    columnWidth() {
      const data = this.element.data;
      return data && data.width ? `col-xs-${data.width}` : 'col-xs-12';
    },
    isDraggable() {
      return this.drag && this.hovered && !this.disabled;
    },
    elementClass() {
      return {
        'focused': this.isFocused,
        'embedded-hovered': this.isDraggable
      };
    }
  },
  methods: {
    ...mapMutations(['focusElement'], 'editor'),
    ...mapActions({ updateElement: 'update' }, 'tes'),
    resolveElement(type) {
      return TE_TYPES[type];
    },
    focus(e) {
      if (this.disabled) return;
      this.focusElement(this.element);
      // Attach component meta
      e.component = { name: 'teaching-element', data: this.element };
    },
    save(data) {
      Object.assign(this.element.data, data);
      this.$emit('save', this.element);
    }
  },
  components: {
    TeHtml,
    TeImage
  }
};
</script>

<style lang="scss" scoped>
.drag-handle {
  position: absolute;
  top: 10px;
  left: 13px;
  z-index: 2;
  width: 26px;
  opacity: 0;

  .mdi {
    color: #888;
    font-size: 28px;
  }
}

.embedded-hovered {
  .drag-handle {
    opacity: 1;
    transition: opacity 0.6s ease-in-out;
    cursor: pointer;
  }
}

.te-container {
  padding-top: 8px;
  padding-bottom: 8px;
}

.teaching-element {
  padding: 10px 20px;
  border: 1px dotted #ccc;
}

.focused {
  > .teaching-element {
    border: 1px solid #90a4ae;
    box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.15);
  }
}

[disabled] .drag-handle {
  display: none;
}
</style>
