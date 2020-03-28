<template>
  <div @click="toggleSelection" class="element-preview-container">
    <v-checkbox
      v-if="selectable"
      @click.prevent
      :value="isSelected"
      :disabled="selectionDisabled" />
    <teaching-element
      :element="element"
      :class="{ selected: isSelected }"
      disabled />
  </div>
</template>

<script>
import TeachingElement from '@/components/editor/TeachingElement';

export default {
  name: 'content-element-preview',
  props: {
    element: { type: Object, required: true },
    selectable: { type: Boolean, default: false },
    isSelected: { type: Boolean, default: false },
    selectionDisabled: { type: Boolean, default: false }
  },
  methods: {
    toggleSelection() {
      if (!this.selectable || this.selectionDisabled) return;
      this.$emit('toggle');
    }
  },
  components: { TeachingElement }
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

.selected {
  border: 1px solid #444;
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
