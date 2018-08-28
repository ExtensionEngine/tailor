<template>
  <component
    :is="node.tagName || 'SPAN'"
    v-bind="getAttributes(node)">
    <template v-for="(element, elementIndex) in node.children">
      <template>
        <component
          v-if="isBlast(element)"
          v-html="element.innerHTML"
          v-bind="getAttributes(element)"
          :key="`${level}.${elementIndex}`"
          :is="element.tagName"
          :class="getClass(element)"
          @click.stop="addSelection(element)"/>
        <selection-node
          v-else
          :key="`${level}.${elementIndex}`"
          :node="element"
          :rootNode="rootNode"
          :selection="selection"
          :level="`[${level},${elementIndex}]`"
          @addSelection="addSelection"
          @removeSelection="removeSelection">
        </selection-node>
      </template>
    </template>
  </component>
</template>

<script>
import {
  getAttributes,
  getNodeSelection,
  isBlast,
  isBlastWord,
  isSelected
} from './helpers';

export default {
  name: 'SelectionNode',
  props: {
    node: { type: Node, required: true },
    rootNode: { type: Node, required: true },
    level: { type: String, required: true },
    selection: { type: Array, required: true },
  },
  methods: {
    getAttributes,
    isBlast,
    getClass(node) {
      return {
        selected: isSelected(node, this.selection),
        blast: true,
        word: isBlastWord(node)
      };
    },
    addSelection(node) {
      if (isSelected(node, this.selection)) {
        const selection = getNodeSelection(node, this.selection);
        return this.removeSelection(selection);
      }
      this.$emit('addSelection', node);
    },
    removeSelection(selection) {
      this.$emit('removeSelection', selection);
    }
  }
};
</script>

<style lang="scss" scoped>
.separator {
  white-space: pre;
}
.selected {
  background-color: rgb(181, 197, 136);
  color: rgb(13, 60, 85);

  :hover {
    cursor: pointer;
  }
}
</style>
