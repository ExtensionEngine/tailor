<template>
  <element-list
    :elements="embeds"
    :supportedTypes="['HTML', 'IMAGE']"
    @add="addItem"
    @update="reorderItem">
    <contained-content
      slot="list-item"
      slot-scope="{ element, isDragged }"
      :element="element"
      :isDragged="isDragged"
      @save="data => saveItem(element, data)"
      @delete="$emit('delete', element)"/>
  </element-list>
</template>

<script>
import { calculatePosition } from './utils';
import cloneDeep from 'lodash/cloneDeep';
import ContainedContent from './ContainedContent';
import ElementList from './ElementList';
import last from 'lodash/last';
import values from 'lodash/values';

export default {
  name: 'embedded-container',
  props: {
    container: { type: Object, required: true }
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
    reorderItem({ newIndex: newPosition }) {
      const isFirstChild = newPosition === 0;
      const context = { items: this.embeds, newPosition, isFirstChild };
      const container = cloneDeep(this.container);
      const reordered = container.embeds[this.embeds[newPosition].id];
      reordered.position = calculatePosition(context);
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
