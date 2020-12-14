<template>
  <element-list
    @add="addItem"
    @update="reorderItem"
    :add-element-options="addElementOptions"
    :elements="embeds"
    :supported-types="types"
    :enable-add="!isDisabled && enableAdd">
    <template v-slot:list-item="{ element, isDragged }">
      <contained-content
        @save="save(element, 'data', $event)"
        @save:meta="save(element, 'meta', $event)"
        @delete="requestDeleteConfirmation(element)"
        :element="element"
        :is-dragged="isDragged"
        :is-disabled="isDisabled"
        v-bind="$attrs"
        class="my-2" />
    </template>
  </element-list>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep';
import ContainedContent from './ContainedContent';
import ElementList from './ElementList';
import last from 'lodash/last';
import { mapRequests } from '@/plugins/radio';
import { resolveElementPosition } from './utils';
import values from 'lodash/values';

export default {
  name: 'embedded-container',
  inheritAttrs: false,
  props: {
    container: { type: Object, required: true },
    types: { type: Array, default: () => ['JODIT_HTML', 'IMAGE', 'HTML', 'VIDEO'] },
    isDisabled: { type: Boolean, default: false },
    addElementOptions: { type: Object, default: () => ({}) },
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
    ...mapRequests('app', ['showConfirmationModal']),
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
    save(item, key, value) {
      const container = cloneDeep(this.container);
      container.embeds[item.id] = { ...item, [key]: value };
      this.$emit('save', container);
    },
    requestDeleteConfirmation(element) {
      this.showConfirmationModal({
        title: 'Delete element?',
        message: 'Are you sure you want to delete element?',
        action: () => this.$emit('delete', element)
      });
    }
  },
  components: { ContainedContent, ElementList }
};
</script>
