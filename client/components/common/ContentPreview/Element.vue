<template>
  <div
    @click="toggleSelection"
    :class="['element-preview-container', elementWidth]">
    <v-checkbox
      v-if="selectable"
      @click.prevent
      :input-value="isSelected"
      :disabled="disabled" />
    <content-element
      :element="element"
      :class="['content-element', { selected: isSelected }]"
      :set-width="false"
      disabled />
  </div>
</template>

<script>
import ContentElement from '@/components/editor/ContentElement';
import get from 'lodash/get';

export default {
  name: 'content-element-preview',
  props: {
    element: { type: Object, required: true },
    selectable: { type: Boolean, default: false },
    isSelected: { type: Boolean, default: false },
    selectionDisabled: { type: Boolean, default: false }
  },
  computed: {
    disabled: vm => vm.selectionDisabled && !vm.isSelected,
    elementWidth: vm => `col-xs-${get(vm.element, 'data.width', 12)}`
  },
  methods: {
    toggleSelection() {
      if (!this.selectable || this.disabled) return;
      this.$emit('toggle');
    }
  },
  components: { ContentElement }
};
</script>

<style lang="scss" scoped>
.element-preview-container {
  display: flex;
  position: relative;

  .v-input {
    margin: 0;
  }
}

.content-element {
  flex: 1 0;

  &.selected {
    border: 1px solid #444;
  }
}

.element-preview-container ::v-deep .contained-content {
  .message span:not(.heading) {
    display: none;
  }

  .ql-editor {
    word-break: break-all;
  }
}
</style>
