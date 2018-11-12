<template>
  <div class="list-group">
    <draggable
      :list="list"
      :options="options"
      @start="dragElementIndex = $event.oldIndex"
      @end="dragElementIndex = -1"
      @update="$emit('update', $event)"
      class="row">
      <div
        v-for="(it, index) in list"
        :key="it._cid || it.id"
        :class="`col-xs-${it.data.width || 12}`"
        @dragstart="dragElementIndex = index"
        @dragend="dragElementIndex = -1">
        <slot
          :item="it"
          :setWidth="false"
          :dragged="dragElementIndex === index"
          name="list-item">
        </slot>
      </div>
    </draggable>
    <add-element
      v-if="enableAdd"
      :include="types"
      :activity="activity"
      :position="nextPosition"
      :layout="layout"
      :locked="elementCreationLocked"
      :elementsLimit="elementsLimit"
      @add="el => $emit('add', el)">
    </add-element>
  </div>
</template>

<script>
import AddElement from './AddElement';
import Draggable from 'vuedraggable';
import last from 'lodash/last';

export default {
  props: {
    list: { type: Array, default() { return []; } },
    dragOptions: { type: Object, default() { return {}; } },
    enableAdd: { type: Boolean, default: true },
    types: { type: Array, default: null },
    activity: { type: Object, required: true },
    layout: { type: Boolean, default: false },
    elementsLimit: { type: Number, default: Infinity }
  },
  data() {
    return { dragElementIndex: null };
  },
  computed: {
    options() {
      return Object.assign(this.dragOptions, {
        handle: '.drag-handle',
        scrollSpeed: 15,
        scrollSensitivity: 125
      });
    },
    elementCreationLocked() {
      return this.elementsLimit === this.list.length;
    },
    nextPosition() {
      const lastItem = last(this.list);
      return lastItem ? lastItem.position + 1 : 1;
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
