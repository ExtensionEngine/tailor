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
        v-for="(item, index) in list"
        :key="item._cid || item.id"
        :class="`col-xs-${item.data.width || 12}`"
        class="list-item-container">
        <add-element
          v-if="enableAdd"
          :include="types"
          :activity="activity"
          :position="index - 1"
          :layout="layout"
          :inline="true"
          @add="el => $emit('insert', el)"/>
        <slot
          :item="item"
          :setWidth="false"
          :setMargin="false"
          :dragged="dragElementIndex === index"
          name="list-item"/>
      </div>
    </draggable>
    <div class="add-element-container">
      <add-element
        v-if="enableAdd"
        :include="types"
        :activity="activity"
        :position="nextPosition"
        :layout="layout"
        @add="el => $emit('add', el)"/>
    </div>
  </div>
</template>

<script>
import AddElement from 'tce-core/AddElement';
import Draggable from 'vuedraggable';
import last from 'lodash/last';

export default {
  props: {
    list: { type: Array, default() { return []; } },
    dragOptions: { type: Object, default() { return {}; } },
    enableAdd: { type: Boolean, default: true },
    types: { type: Array, default: null },
    activity: { type: Object, required: true },
    layout: { type: Boolean, default: false }
  },
  data() {
    return {
      dragElementIndex: -1
    };
  },
  computed: {
    options() {
      return Object.assign(this.dragOptions, {
        handle: '.drag-handle',
        scrollSpeed: 15,
        scrollSensitivity: 125
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
/* Do not remove! Makes sure vuedraggable detects correct scrollable parent */
.list-group {
  padding: 10px 15px;
}

.list-item-container {
  &.sortable-drag {
    margin: 0;
    padding: 0;

    /deep/ .inline-activator {
      display: none;
    }
  }
}
</style>
