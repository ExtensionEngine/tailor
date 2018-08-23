<template>
  <div>
    <div class="selector ql-editor">
      <selection-node
        :node="rootNode"
        :rootNode="rootNode"
        :selection="selection"
        :level="'0'"
        @addSelection="addSelection"
        @removeSelection="removeRange"/>
    </div>
  </div>
</template>

<script>
import {
  getIndex,
  getSelectedWords,
  mergeSelection,
  removeSelection
} from './helpers';
import cloneDeep from 'lodash/cloneDeep';
import first from 'lodash/first';
import isEmpty from 'lodash/isEmpty';
import last from 'lodash/last';
import SelectionNode from './SelectionNode';

export default {
  props: {
    rootNode: { type: HTMLElement, required: true },
    correct: { type: Array, required: true },
    isEditing: { type: Boolean, required: true }
  },
  data() {
    return {
      selection: cloneDeep(this.correct)
    };
  },
  methods: {
    selectionEnd() {
      if (!this.isEditing) return;
      const selections = cloneDeep(this.selection);
      const selection = getSelectedWords();
      if (isEmpty(selection)) return;
      if (last(selection) - first(selection) === 1) return;
      this.selection = mergeSelection(selections, selection);
      this.save();
      document.getSelection().removeAllRanges();
    },
    addSelection(node) {
      if (!this.isEditing) return;
      const index = getIndex(node);
      const selections = cloneDeep(this.selection);
      this.selection = mergeSelection(selections, [index, index + 1]);
      this.save();
      document.getSelection().removeAllRanges();
    },
    removeRange(selection) {
      if (!this.isEditing) return;
      const selections = cloneDeep(this.selection);
      this.selection = removeSelection(selections, selection);
      this.save();
    },
    save() {
      this.$emit('save', this.selection);
    }
  },
  created() {
    document.addEventListener('mouseup', this.selectionEnd);
  },
  beforeDestroy() {
    document.removeEventListener('mouseup', this.selectionEnd);
  },
  components: {
    SelectionNode
  }
};
</script>

<style lang="scss" scoped>
.selector {
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
