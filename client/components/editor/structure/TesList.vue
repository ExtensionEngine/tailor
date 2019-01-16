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
        v-for="({ te, key, width, canAddBefore, clearfix }, index) in tes"
        :key="key"
        :class="{ clearfix }"
        class="list-item-container">
        <insert-element
          v-if="canAddBefore"
          :include="types"
          :activity="activity"
          :position="index - 1"
          :layout="layout"
          @add="el => $emit('insert', el)"/>
        <div :class="`col-xs-${width}`">
          <slot
            :item="te"
            :setWidth="false"
            :dragged="dragElementIndex === index"
            name="list-item"/>
        </div>
      </div>
    </draggable>
    <div class="add-element-container">
      <add-element
        v-if="enableAdd"
        :include="types"
        :activity="activity"
        :position="nextPosition"
        :layout="layout"
        :top="true"
        @add="el => $emit('add', el)"/>
    </div>
  </div>
</template>

<script>
import AddElement from './AddElement';
import Draggable from 'vuedraggable';
import InsertElement from './InsertElement';
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
    tes() {
      let skipAdd = false;
      return this.list.map(te => {
        const key = te._cid || te.id;
        const canAddBefore = !skipAdd;
        const width = te.data.width || 12;
        const clearfix = width === 12 || !canAddBefore;
        skipAdd = width < 12 && !skipAdd;
        return { te, key, width, canAddBefore, clearfix };
      });
    },
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
  components: {
    AddElement,
    InsertElement,
    Draggable
  }
};
</script>

<style lang="scss" scoped>
/* Do not remove! Makes sure vuedraggable detects correct scrollable parent */
.list-group {
  padding: 10px 15px;
}

.add-element-container {
  position: relative;
}

.list-item-container {
  &.sortable-drag {
    margin: 0;
    padding: 0;

    .insert-element {
      display: none;
    }

    div[class^="col"] {
      padding: 0;
    }

    /deep/ .te-container {
      padding: 0;
    }
  }
}
</style>
