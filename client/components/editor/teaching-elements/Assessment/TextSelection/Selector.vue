<template>
  <div
    @mouseup="onMouseup">
    <div
      v-html="structure"
      :class="{ editing: this.isEditing }"
      class="selector ql-editor"/>
  </div>
</template>

<script>
import {
  generateStructure,
  getSelectedWords,
  isBlast,
  isSelected,
  nodeMapper,
  modifySelectionNodes
} from './helpers';
import isEmpty from 'lodash/isEmpty';
import Selections from './Selections';
import curry from 'lodash/curry';

export default {
  props: {
    correct: { type: Array, required: true },
    isEditing: { type: Boolean, required: true },
    content: { type: String, required: true }
  },
  data() {
    const selections = new Selections(this.correct);
    const processNode = selections.processNode.bind(selections);
    const mapper = curry(nodeMapper)(processNode);
    return {
      selections,
      structure: generateStructure(this.content, mapper)
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
        const range = Selections.extract(node);
        this.removeSelection(range);
      }
    },
    addSelection(selection) {
      if (!this.isEditing) return;
      const range = this.selections.merge(selection);
      const options = {
        addClass: 'selected',
        setAttribute: { name: 'range', value: range }
      };
      modifySelectionNodes(this.$el, range, options);
      this.save();
      document.getSelection().removeAllRanges();
    },
    removeSelection(range) {
      this.selections.remove(range);
      const options = {
        removeClass: 'selected',
        removeAttribute: 'range'
      };
      modifySelectionNodes(this.$el, range, options);
      this.save();
    },
    save() {
      this.$emit('save', this.selections.ranges);
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
