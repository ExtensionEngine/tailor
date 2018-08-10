<template>
  <div>
    <div class="selector ql-editor">
      <selection-node
        :nodes="rootNode.childNodes"
        :level="1"
        :selected="selected"
        @addSelection="addSelection"
        @removeSelection="removeSelectedRange"
      />
    </div>
  </div>
</template>

<script>
import find from 'lodash/find';
import map from 'lodash/map';
import first from 'lodash/first';
import last from 'lodash/last';
import filter from 'lodash/filter';
import curry from 'lodash/curry';
import curryRight from 'lodash/curryRight';
import isEmpty from 'lodash/isEmpty';
import inRange from 'lodash/inRange';
import isArray from 'lodash/isArray';
import cloneDeep from 'lodash/cloneDeep';
import sortedIndexBy from 'lodash/sortedIndexBy';
import SelectionNode from './SelectionNode';

const idPrefix = 'text-content-';
const getIndex = ({id}) => (Number(id.substring(idPrefix.length)));
const firstOrRef = (col) => (first(col) || col);
const lastOrRef = (col) => (last(col) || col);

export default {
  props: {
    rootNode: { type: HTMLElement, required: true },
    selection: { type: Array, required: true },
    isEditing: { type: Boolean, required: true }
  },
  data() {
    return {
      selected: cloneDeep(this.selection),
    };
  },
  methods: {
    mergeSelection(selection) {
      const selected = cloneDeep(this.selected);
      const start = first(selection);
      const end = last(selection);
      const check = curry(isOverlapsed);
      const startOverlapse = find(selected, check(start));
      const endOverlapse = find(selected, check(end));
      let range = [
        first(startOverlapse) || start,
        last(endOverlapse) || end
      ];
      this.removeSelectedRange(range);
      if (first(range) === last(range)) range = first(range);
      const index = sortedIndexBy(selected, range, firstOrRef);
      selected.splice(index, 0, range);
      this.selected = selected;
      this.save();
    },
    selectionEnd() {
      if (!this.isEditing) return;
      const domSelection = document.getSelection();
      if (domSelection.rangeCount === 0) return;
      const range = domSelection.getRangeAt(0);
      const fragment = range.cloneContents();
      const blastSelector = 'span.blast';
      let selection = fragment.querySelectorAll(blastSelector);
      if (isEmpty(selection)) return;
      const selectionIds = map(selection, getIndex);
      this.mergeSelection(selectionIds);
      document.getSelection().removeAllRanges();
    },
    addSelection(node) {
      if (!this.isEditing) return;
      const index = getIndex(node);
      this.mergeSelection([index]);
    },
    removeSelectedRange(range) {
      if (!this.isEditing) return;
      let selected = cloneDeep(this.selected);
      const check = curryRight(isOverlapsed)(range);
      selected = filter(selected, selection => (
        !check(firstOrRef(selection)) && !check(lastOrRef(selection))
      ));
      this.selected = selected;
    },
    save() {
      this.$emit('save', this.selected);
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

function isOverlapsed(index, selection) {
  const start = first(selection) || selection;
  const end = last(selection) || selection;
  return isArray(selection)
    ? inRange(index, start, end + 1)
    : index === selection;
}
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
