<template>
  <element-list
    @add="addItem"
    @update="reorderItem"
    :elements="embeds"
    :supported-types="types">
    <template v-slot:list-item="{ element, isDragged }">
      <contained-content
        @save="data => saveItem(element, data)"
        @delete="$emit('delete', element)"
        :element="element"
        :is-dragged="isDragged"
        v-bind="$attrs" />
    </template>
  </element-list>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep';
import ContainedContent from './ContainedContent';
import ElementList from './ElementList';
import last from 'lodash/last';
import { resolveElementPosition } from './utils';
import values from 'lodash/values';

export default {
  name: 'embedded-container',
  inheritAttrs: false,
  props: {
    container: { type: Object, required: true },
    types: { type: Array, default: () => ['JODIT_HTML', 'IMAGE', 'HTML'] },
    enableAdd: { type: Boolean, default: true }
  },
  computed: {
    embeds() {
      const items = this.container.embeds;
      return items ? values(items).sort((a, b) => a.position - b.position) : [];
    },
    nextPosition() {
      return this.embeds.length ? last(this.embeds).position + 1 : 1;
    }
  },
  methods: {
    addItem(item) {
      const container = cloneDeep(this.container);
      if (!item.position) item.position = this.nextPosition;
      container.embeds = container.embeds || {};
      container.embeds[item.id] = item;
      this.$emit('save', container);
    },
    reorderItem({ newPosition, items }) {
      const isFirstChild = newPosition === 0;
      const context = { items, newPosition, isFirstChild };
      const container = cloneDeep(this.container);
      const reordered = container.embeds[items[newPosition].id];
      reordered.position = resolveElementPosition(context);
      this.$emit('save', container);
    },
    saveItem(item, data) {
      const container = cloneDeep(this.container);
      container.embeds[item.id] = { ...item, data };
      this.$emit('save', container);
    }
  },
  components: { ContainedContent, ElementList }
};
</script>
