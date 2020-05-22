<template>
  <div class="list-group">
    <draggable
      @start="dragElementIndex = $event.oldIndex"
      @end="dragElementIndex = -1"
      @update="reorder"
      :list="elements"
      v-bind="options"
      class="row">
      <div
        v-for="(element, index) in elements"
        :key="getElementId(element.id)"
        @dragstart="dragElementIndex = index"
        @dragend="dragElementIndex = -1"
        :class="`col-xs-${get(element, 'data.width', 12)}`">
        <slot
          :element="element"
          :isDragged="dragElementIndex === index"
          :position="index"
          name="list-item">
        </slot>
      </div>
    </draggable>
    <add-element
      v-if="enableAdd"
      @add="el => $emit('add', el)"
      :include="supportedTypes"
      :activity="activity"
      :position="nextPosition"
      :layout="layout"
      v-bind="$attrs" />
  </div>
</template>

<script>
import AddElement from './AddElement';
import Draggable from 'vuedraggable';
import get from 'lodash/get';
import { getElementId } from 'tce-core/utils';
import last from 'lodash/last';

export default {
  name: 'element-list',
  props: {
    elements: { type: Array, default: () => ([]) },
    supportedTypes: { type: Array, default: null },
    activity: { type: Object, default: null },
    layout: { type: Boolean, default: false },
    enableAdd: { type: Boolean, default: true }
  },
  data() {
    return { dragElementIndex: null };
  },
  computed: {
    options() {
      return {
        handle: '.drag-handle',
        scrollSpeed: 15,
        scrollSensitivity: 125
      };
    },
    nextPosition() {
      const lastItem = last(this.elements);
      return lastItem ? lastItem.position + 1 : 1;
    }
  },
  methods: {
    get,
    getElementId,
    reorder({ newIndex: newPosition }) {
      const items = this.elements;
      this.$emit('update', { newPosition, items });
    }
  },
  components: { AddElement, Draggable }
};
</script>

<style lang="scss" scoped>
/* Do not remove! Makes sure vuedraggable detects correct scrollable parent */
.list-group {
  padding: 10px 15px;
}
</style>
