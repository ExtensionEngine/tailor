<template>
  <div class="list-group">
    <draggable
      :list="list"
      :options="dragOptions"
      @start="dragElementIndex = $event.oldIndex"
      @end="dragElementIndex = -1"
      @update="$emit('update', $event)"
      class="row">
      <div
        v-for="(it, index) in list"
        :key="it._cid || it.id"
        @dragstart="dragElementIndex = index"
        @dragend="dragElementIndex = -1">
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
    dragOptions: {
      type: Object,
      default() { return { handle: '.drag-handle' }; }
    },
    enableAdd: { type: Boolean, default: true },
    types: { type: Array, required: true },
    activity: { type: Object, required: true },
    layout: { type: Boolean, default: false }
  },
  data() {
    return { dragElementIndex: null };
  },
  computed: {
    nextPosition() {
      const lastItem = last(this.list);
      return lastItem ? lastItem.position + 1 : 1;
    }
  },
  components: { AddElement, Draggable }
};
</script>
