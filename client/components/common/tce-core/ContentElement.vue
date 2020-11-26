<template>
  <div
    @click="onSelect"
    :class="{ focused: isFocused, frame }"
    class="content-element">
    <discussion v-if="hasComments" :content-element="element" />
    <component
      :is="componentName"
      @add="$emit('add', $event)"
      @save="$emit('save', $event)"
      @delete="$emit('delete')"
      @focus="onSelect"
      :id="`element_${id}`"
      v-bind="{ ...$attrs, element, isFocused, isDragged, isDisabled, dense }" />
  </div>
</template>

<script>
import { getComponentName, getElementId } from './utils';
import Discussion from '@/components/repository/common/ContentElementDiscussion';
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
    dense: { type: Boolean, default: false },
    hasComments: { type: Boolean, default: true }
  },
  data: () => ({ isFocused: false }),
  computed: {
    ...mapChannels({ editorChannel: 'editor' }),
    id: vm => getElementId(vm.element),
    componentName: vm => getComponentName(vm.element.type),
    elementBus: vm => vm.$radio.channel(`element:${vm.id}`)
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
    return { $elementBus: this.elementBus };
  },
  components: { Discussion }
};
</script>

<style lang="scss" scoped>
.content-element {
  position: relative;
  $accent: #1de9b6;

  &.focused {
    border: 1px dashed $accent;

    &::after {
      $width: 0.125rem;

      content: '';
      position: absolute;
      top: 0;
      right: -$width;
      width: $width;
      height: 100%;
      background: $accent;
    }
  }
}

.frame {
  padding: 10px 20px;
  border: 1px solid #e1e1e1;
}
</style>
