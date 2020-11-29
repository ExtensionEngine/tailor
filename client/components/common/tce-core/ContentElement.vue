<template>
  <div
    @click="onSelect"
    :class="{ focused: isFocused, frame }"
    class="content-element">
    <component
      :is="componentName"
      @add="$emit('add', $event)"
      @save="$emit('save', $event)"
      @delete="$emit('delete')"
      @focus="onSelect"
      :id="`element_${id}`"
      v-bind="$attrs"
      :element="element"
      :is-focused="isFocused"
      :is-dragged="isDragged"
      :is-disabled="isDisabled"
      :dense="dense"
      class="content" />
  </div>
</template>

<script>
import { getComponentName, getElementId } from './utils';
import { mapChannels } from '@/plugins/radio';

export default {
  name: 'content-element',
  inheritAttrs: false,
  props: {
    element: { type: Object, required: true },
    parent: { type: Object, default: null },
    isDragged: { type: Boolean, default: false },
    isDisabled: { type: Boolean, default: false },
    frame: { type: Boolean, default: true },
    dense: { type: Boolean, default: false }
  },
  data: () => ({ isFocused: false }),
  computed: {
    ...mapChannels({ editorChannel: 'editor' }),
    id() {
      return getElementId(this.element);
    },
    componentName() {
      return getComponentName(this.element.type);
    },
    elementBus() {
      return this.$radio.channel(`element:${this.id}`);
    }
  },
  methods: {
    onSelect(e) {
      if (this.isDisabled || e.component) return;
      this.focus();
      e.component = { name: 'content-element', data: this.element };
    },
    focus() {
      this.editorChannel.emit('element:focus', this.element, this.parent);
    }
  },
  created() {
    // Element listeners
    this.elementBus.on('save:meta', meta => this.$emit('save:meta', meta));
    this.elementBus.on('delete', () => this.$emit('delete'));
    // Editor listeners
    this.editorChannel.on('element:select', elementId => {
      if (this.id !== elementId) return;
      this.focus();
    });
    this.editorChannel.on('element:focus', element => {
      this.isFocused = !!element && (getElementId(element) === this.id);
    });
  },
  provide() {
    return {
      $elementBus: this.elementBus
    };
  }
};
</script>

<style lang="scss" scoped>
.content-element {
  position: relative;
  $accent: #1de9b6;

  .content {
    z-index: 1;
  }

  &.focused {
    &.frame {
      box-shadow: none;
    }

    &::after {
      $width: 0.125rem;

      content: '';
      position: absolute;
      // Cover the same block as box-shadow
      top: -1px;
      left: -1px;
      width: calc(100% + 2px);
      height: calc(100% + 2px);
      border: 1px dashed $accent;
      border-right: $width solid $accent;
      z-index: 0;
    }
  }
}

.frame {
  padding: 10px 20px;
  box-shadow: 0 0 0 1px #e1e1e1;
}
</style>
