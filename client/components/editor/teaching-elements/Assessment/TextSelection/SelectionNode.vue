<template>
  <span>
    <span
      v-for="(group, index) in nodeGroups"
      :key="`${level}.${index}`"
      :class="{selected: group.type === 'selected'}"
      @click.stop="removeSelection(group.selection, group)">
      <template v-for="(node, index) in group.nodes">
        <span
          v-if="getType(node) === 'text'"
          :key="`${level}.${index}`"
          class="separator"
          :ref="`separator.${index}`"
        >{{ node.textContent }}</span>
        <span
          v-else-if="getType(node) === 'blast'"
          :key="`${level}.${index}`"
          v-html="node.outerHTML"
          @click.stop="addSelection(node, group.selection)"
          ref="word"/>
        <component
          v-else-if="getType(node) === 'UL' || getType(node) === 'OL'"
          :key="`${level}.${index}`"
          :is="node.tagName"
          v-bind="getAttributes(node)">
          <component
            v-for="(item, index) in node.childNodes"
            :key="`item.${index}`"
            :is="item.tagName"
            v-bind="getAttributes(node)">
            <selection-node
              v-if="hasChildren(item)"
              :nodes="item.childNodes"
              :level="level+1"
              :selected="selected"
              @addSelection="addSelection"
              @removeSelection="removeSelection"
            />
          </component>
        </component>
        <component
          v-else
          :key="`${level}.${index}`"
          :is="node.tagName"
          v-bind="getAttributes(node)">
          <selection-node
            v-if="hasChildren(node)"
            :nodes="node.childNodes"
            :level="level+1"
            :selected="selected"
            @addSelection="addSelection"
            @removeSelection="removeSelection"
          />
        </component>
      </template>
    </span>
  </span>
</template>

<script>
import first from 'lodash/first';
import last from 'lodash/last';
import find from 'lodash/find';
import reduce from 'lodash/reduce';
import invoke from 'lodash/invoke';
import isEmpty from 'lodash/isEmpty';
import isUndefined from 'lodash/isUndefined';
import isNumber from 'lodash/isNumber';
import inRange from 'lodash/inRange';

const idPrefix = 'text-content-';
const getIndex = ({id}) => Number(invoke(id, 'substring', idPrefix.length));
const firstOrRef = (col) => (first(col) || col);
const lastOrRef = (col) => (last(col) || col);

const STATUS = {
  NOT_WORD: 'not-word',
  LAST: 'last',
  UNSELECTED: 'unselected',
  SINGLE_SELECTED: 'single-selected',
  FIRST_SELECTED: 'first-selected',
  SELECTED: 'selected'
};

export default {
  name: 'SelectionNode',
  props: {
    level: { type: Number, required: true },
    nodes: { type: NodeList, required: true },
    selected: { type: [Array], required: true },
  },
  computed: {
    wordIndexes() {
      return reduce(this.nodes, (indexes, {id}) => {
        if (!id) return indexes;
        const index = getIndex({id});
        if (index) indexes.push(index);
        return indexes;
      }, []);
    },
    nodeGroups() {
      return reduce(this.nodes, (groups, node) => {
        const status = this.getNodeSelectionStatus(node);
        const selection = this.getNodeSelection(node);
        const group = last(groups);
        switch (status) {
          case STATUS.NOT_WORD:
            group.nodes.push(node);
            return groups;
          case STATUS.LAST:
            group.nodes.push(node);
            group.type = 'unselected';
            return groups;
          case STATUS.UNSELECTED:
            group.nodes.push(node);
            group.type = 'unselected';
            groups.push({ nodes: [] });
            return groups;
          case STATUS.SINGLE_SELECTED:
            group.type = 'unselected';
            groups.push({ type: 'selected', nodes: [node], selection });
            groups.push({ nodes: [] });
            return groups;
          case STATUS.FIRST_SELECTED:
            group.type = 'unselected';
            groups.push({ nodes: [node] });
            return groups;
          default:
            group.nodes.push(node);
            group.type = 'selected';
            group.selection = selection;
            groups.push({ nodes: [] });
            return groups;
        }
      }, [{ nodes: [] }]);
    }
  },
  methods: {
    getType(node) {
      if (node.nodeType === 3) return 'text';
      const nodeClass = node.getAttribute('class');
      if (invoke(nodeClass, 'includes', 'blast')) return 'blast';
      return node.tagName;
    },
    getStyle(node) {
      const style = node.getAttribute('style');
      return style || '';
    },
    hasChildren(node) {
      return !isEmpty(node.childNodes);
    },
    getAttributes(node) {
      return reduce(
        node.attributes,
        (attrs, {name, value}) => ({...attrs, [name]: value}),
        {}
      );
    },
    getNodeSelection(node) {
      const index = getIndex(node);
      return find(
        this.selected,
        selection =>
          inRange(index, firstOrRef(selection), lastOrRef(selection) + 1)
      );
    },
    getNodeSelectionStatus(node) {
      const {id} = node;
      const isLastNode = node === last(this.nodes);
      const index = getIndex(node);
      const selection = this.getNodeSelection(node);
      const isFirst = index === firstOrRef(selection);
      const isLastWord = last(this.wordIndexes) === index;
      if (!id && !isLastNode) return STATUS.NOT_WORD;
      if (!id && isLastNode) return STATUS.LAST;
      if (isUndefined(selection) && !isLastNode) return STATUS.UNSELECTED;
      if (isUndefined(selection) && isLastNode) return STATUS.LAST;
      if (isNumber(selection)) return STATUS.SINGLE_SELECTED;
      if (isFirst && isLastWord) return STATUS.SINGLE_SELECTED;
      if (isFirst) return STATUS.FIRST_SELECTED;
      return STATUS.SELECTED;
    },
    addSelection(node, selection) {
      const selectionExists = !isUndefined(selection);
      if (selectionExists) return this.$emit('removeSelection', selection);
      this.$emit('addSelection', node);
      document.getSelection().removeAllRanges();
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
