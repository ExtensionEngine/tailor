<template>
  <component
    :is="node.tagName || 'SPAN'"
    v-bind="getAttributes(node)"
    :class="{ 'separator': !node.tagName }">
    <template v-if="!node.tagName">{{ node.textContent }}</template>
    <template
      v-else
      v-for="(item, itemIndex) in groupNodes(rootNode, node, selection)">
      <template v-if="isNode(item)">
        <component
          v-if="isBlast(item)"
          v-html="item.innerHTML"
          v-bind="getAttributes(item)"
          :key="`${level}.${itemIndex}`"
          :is="item.tagName"
          @click.stop="addSelection(item)"/> 
        <selection-node
          v-else
          :key="`${level}.${itemIndex}`"
          :node="item"
          :rootNode="rootNode"
          :selection="selection"
          :level="`[${level},${itemIndex}]`"
          @addSelection="addSelection"
          @removeSelection="removeSelection">
        </selection-node>
      </template>
      <span
        v-else
        :key="`${level}.${itemIndex}`"
        @click.stop="removeSelection(item.selection)"
        class="selected">
        <template
          v-for="(node, nodeIndex) in item.nodes">
          <component
            v-if="isBlast(node)"
            :key="`${level}.${itemIndex}.${nodeIndex}`"
            :is="node.tagName"
            v-html="node.innerHTML"
            v-bind="getAttributes(node)"/>
          <selection-node
            v-else
            :key="`${level}.${itemIndex}.${nodeIndex}`"
            :node="node"
            :rootNode="rootNode"
            :selection="selection"
            :level="`[${level},${itemIndex}, ${nodeIndex}]`"
            @addSelection="addSelection"
            @removeSelection="removeSelection">
          </selection-node>
        </template>
      </span>
    </template>
  </component>
</template>

<script>
import { getAttributes, groupNodes, isBlast, isNode } from './helpers';
import isUndefined from 'lodash/isUndefined';

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
    isNode,
    isBlast,
    groupNodes,
    addSelection(node) {
      this.$emit('addSelection', node);
    },
    removeSelection(selection) {
      if (isUndefined(selection)) return;
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
