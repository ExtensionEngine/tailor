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
        :key="element.id"
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
      :activity="activity"
      :include="supportedTypes"
      :layout="layout"
      :show.sync="showElementDrawer" />
  </div>
</template>

<script>
import AddElement from './AddElement';
import Draggable from 'vuedraggable';
import get from 'lodash/get';

export default {
  name: 'element-list',
  props: {
    elements: { type: Array, default: () => ([]) },
    supportedTypes: { type: Array, default: null },
    activity: { type: Object, default: null },
    layout: { type: Boolean, default: false },
    enableAdd: { type: Boolean, default: true }
  },
  data: () => ({ dragElementIndex: null, showElementDrawer: false }),
  computed: {
    options: () => ({
      handle: '.drag-handle',
      scrollSpeed: 15,
      scrollSensitivity: 125
    })
  },
  methods: {
    get,
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
