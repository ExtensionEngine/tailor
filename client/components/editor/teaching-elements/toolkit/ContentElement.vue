<template>
  <div
    :class="{ focused: isFocused }"
    @click="focus"
    class="content-element">
    <component
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
  props: {
    element: { type: Object, required: true },
    isDragged: { type: Boolean, default: false },
    isDisabled: { type: Boolean, default: false }
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
      EventBus.emit('element:focus', this.element);
      e.component = { name: 'content-element', data: this.element };
    }
  },
  created() {
    EventBus.on('element:focus', element => {
      this.isFocused = !!element && (getElementId(element) === this.id);
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
  padding: 10px 20px;
  border: 1px dotted #ccc;

  &.focused {
    border: 1px solid #90a4ae;
    box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.15);
  }
}
</style>
