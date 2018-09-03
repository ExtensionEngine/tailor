<template>
  <div
    v-html="html"
    :class="{ editing: this.isEditing }"
    @mouseup="e => isEditing && onMouseup(e)"
    class="selector ql-editor">
  </div>
</template>

<script>
import {
  generateHtml,
  getSelectionRange,
  getText,
  isBlast,
  toggleAttributes,
  toggleClasses,
  nodeMapper,
  processNode,
  isSelected,
  extractRange
} from './helpers';
import Selections from './Selections';

export default {
  props: {
    correct: { type: Array, required: true },
    isEditing: { type: Boolean, required: true },
    content: { type: String, required: true }
  },
  data() {
    const selections = new Selections(this.correct);
    const prepare = node => processNode(node, selections);
    const html = generateHtml(this.content,
      (node, index) => nodeMapper(prepare, node, index)
    );
    return { selections, html };
  },
  methods: {
    onMouseup(event) {
      const node = event.target;
      let range = getSelectionRange();
      if (range && !range.isCollapsed) {
        this.addRange(range);
      } else if (isSelected(node) && isBlast(node)) {
        range = extractRange(node);
        this.removeRange(range);
      }
    },
    addRange(selection) {
      const range = this.selections.merge(selection);
      getText(this.$el, range).forEach(el => {
        toggleClasses(el, { selected: true });
        toggleAttributes(el, { range });
      });
      this.save();
      document.getSelection().removeAllRanges();
    },
    removeRange(range) {
      this.selections.remove(range);
      getText(this.$el, range).forEach(el => {
        toggleClasses(el, { selected: false });
        toggleAttributes(el, { range: null });
      });
      this.save();
    },
    save() {
      this.$emit('save', { selection: this.selections.ranges });
    }
  }
};
</script>

<style lang="scss" scoped>
$selectionBackground: #b5c588;
$selectionColor: #0d3c55;

.selector {
  &.editing ::selection {
    background: lighten($selectionBackground, 20%);
  }

  /deep/ .selected {
    background: $selectionBackground;
    color: $selectionColor;
  }
}
</style>
