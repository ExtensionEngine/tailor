<template>
  <div
    @mouseup="onMouseup">
    <div
      v-html="rootNode.innerHTML"
      :class="{ editing: this.isEditing }"
      class="selector ql-editor"/>
  </div>
</template>

<script>
import {
  getSelectedWords,
  getSelection,
  isBlast,
  isSelected,
  modifySelectionNodes,
  Selection
} from './helpers';
import cloneDeep from 'lodash/cloneDeep';
import isEmpty from 'lodash/isEmpty';

export default {
  props: {
    correct: { type: Array, required: true },
    isEditing: { type: Boolean, required: true },
    rootNode: { type: HTMLElement, required: true }
  },
  data() {
    return {
      selections: cloneDeep(this.correct),
      protected: []
    };
  },
  methods: {
    onMouseup(event) {
      if (!this.isEditing) return;
      const node = event.target;
      const domSelection = document.getSelection();
      const selection = getSelectedWords();
      if (!isEmpty(selection) && !domSelection.isCollapsed) {
        this.addSelection(selection);
      } else if (isSelected(node) && isBlast(node)) {
        const range = getSelection(node);
        this.removeSelection(range);
      }
    },
    addSelection(selection) {
      if (!this.isEditing) return;
      const merge = Selection.merge(this.selections, selection);
      const { selections, range } = merge;
      const options = {
        addClass: 'selected',
        setAttribute: { name: 'range', value: range }
      };
      this.selections = selections;
      modifySelectionNodes(this.$el, range, options);
      this.save();
      document.getSelection().removeAllRanges();
    },
    removeSelection(range) {
      this.selections = Selection.remove(this.selections, range);
      const options = {
        removeClass: 'selected',
        removeAttribute: 'range'
      };
      modifySelectionNodes(this.$el, range, options);
      this.save();
    },
    save() {
      this.$emit('save', this.selections);
    }
  }
};
</script>

<style lang="scss" scoped>
$selectionBackground: rgb(181, 197, 136);
$selectionColor: rgb(13, 60, 85);

.selector {
  &.editing {
    ::selection {
      background: lighten($selectionBackground, 20%);
    }
  }

  /deep/ .selected {
    background: $selectionBackground;
    color: $selectionColor;
  }

  .separator {
    white-space: pre;
  }

  .targeted {
    background-color: #42b983;
  }
}

.ql-editor{
  height: 0%;
}
</style>
