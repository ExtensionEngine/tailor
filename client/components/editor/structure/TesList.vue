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
        @dragstart="dragElementIndex = index"
        @dragend="dragElementIndex = -1"
        class="col-xs-12">
        <slot
          name="list-item"
          :item="it"
          :dragged="dragElementIndex === index">
        </slot>
      </div>
    </draggable>
    <add-element
      v-if="enableAdd"
      :include="types"
      :activity="activity"
      :position="nextPosition"
      :layout="layout"
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
    types: { type: Array, required: false },
    activity: { type: Object, required: true },
    layout: { type: Boolean, default: false }
  },
  data() {
    return { dragElementIndex: null };
  },
  computed: {
    options() {
      return Object.assign(this.dragOptions, {
        handle: '.drag-handle',
        scrollSpeed: 25,
        scrollSensitivity: 150
      });
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
// TODO: Find proper way to handle this
// DO NOT REMOVE! Makes sure vuedraggable detects correct scrollable parent
.list-group {
  padding: 10px 15px;
}
</style>
