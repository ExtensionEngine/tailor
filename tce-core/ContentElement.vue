<template>
  <div
    :class="{ focused: isFocused, frame }"
    @click="focus"
    class="content-element">
    <component
      v-bind="$attrs"
      :is="componentName"
      :element="element"
      :isFocused="isFocused"
      :isDragged="isDragged"
      @save="data => $emit('save', data)"/>
  </div>
</template>

<script>
import { getComponentName, getElementId } from './utils';
import EventBus from 'EventBus';

export default {
  name: 'content-element',
  inheritAttrs: false,
  props: {
    element: { type: Object, required: true },
    parent: { type: Object, default: null },
    isDragged: { type: Boolean, default: false },
    isDisabled: { type: Boolean, default: false },
    frame: { type: Boolean, default: true }
  },
  data() {
    return { isFocused: false };
  },
  computed: {
    id() {
      return getElementId(this.element);
    },
    componentName() {
      return getComponentName(this.element.type);
    }
  },
  methods: {
    focus(e) {
      if (this.isDisabled || e.component) return;
      EventBus.emit('element:focus', this.element, this.parent);
      e.component = { name: 'content-element', data: this.element };
    }
  },
  created() {
    EventBus.on('element:focus', element => {
      this.isFocused = !!element && (getElementId(element) === this.id);
      this.$emit('focus', this.isFocused);
    });
  },
  provide() {
    return {
      $elementBus: EventBus.channel(`element:${this.id}`)
    };
  }
};
</script>

<style lang="scss" scoped>
.content-element {
  position: relative;

  &.focused {
    border: 1px solid #90a4ae;
    box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.15);
  }
}

.frame {
  padding: 10px 20px;
  border: 1px dotted #ccc;
}
</style>
