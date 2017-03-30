<template>
  <div
    :class="[columnWidth, hovered ? 'embed-hovered' : '']"
    @mouseover="hovered = true"
    @mouseleave="hovered = false"
    class="te-container">
    <div @click="focus" class="embed-element">
      <span class="embed-drag-handle">
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
import { mapActions, mapGetters, mapMutations } from 'vuex-module';
import TeHtml from './Html';
import TeImage from './Image';

const TE_TYPES = { HTML: 'te-html', IMAGE: 'te-image' };

export default {
  name: 'te-primitive',
  props: {
    initialElement: Object,
    disabled: Boolean
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
      if (!this.focusedElement.type) return false;
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
    ...mapMutations(['focusElement'], 'editor'),
    ...mapActions({ updateElement: 'update' }, 'tes'),
    resolveElement(type) {
      return TE_TYPES[type];
    },
    focus(e) {
      if (this.disabled) return;
      this.focusElement(this.element);
      // Attach component meta
      e.component = { name: 'embed-element', data: this.element };
    },
    save(elementData) {
      let data = cloneDeep(this.element.data);
      Object.assign(data, elementData);
      this.$emit('save', { ...this.element, data });
    }
  },
  components: {
    TeHtml,
    TeImage
  }
};
</script>

<style lang="scss" scoped>
.embed-drag-handle {
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

.embed-hovered {
  .embed-drag-handle {
    opacity: 1;
    transition: opacity .6s ease-in-out;
    cursor: pointer;
  }
}

.te-container {
  padding-top: 8px;
  padding-bottom: 8px;
}

.embed-element {
  padding: 10px 20px;
  border: 1px dashed #ccc;
}
</style>
