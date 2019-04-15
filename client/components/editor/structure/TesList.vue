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
        :class="getContainerClasses(item)"
        class="list-item-container">
        <inline-activator
          v-if="enableAdd"
          @click.native="showElementDrawer(index - 1)"/>
        <slot
          :item="item"
          :setWidth="false"
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
        :show="isElementDrawerVisible"
        @hide="hideElementDrawer"
        @add="el => $emit(additionType, el)"/>
    </div>
  </div>
</template>

<script>
import AddElement from 'tce-core/AddElement';
import Draggable from 'vuedraggable';
import InlineActivator from './InlineActivator';
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
      dragElementIndex: -1,
      nextPosition: 0,
      isElementDrawerVisible: false
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
    lastPosition() {
      const lastItem = last(this.list);
      return lastItem ? lastItem.position + 1 : 1;
    },
    additionType() {
      const { list, nextPosition, lastPosition } = this;
      return !list.length || nextPosition === lastPosition ? 'add' : 'insert';
    }
  },
  methods: {
    showElementDrawer(position) {
      this.nextPosition = position;
      this.isElementDrawerVisible = true;
    },
    hideElementDrawer() {
      this.isElementDrawerVisible = false;
      this.nextPosition = this.lastPosition;
    },
    getContainerClasses({ data: { width } }) {
      let classes = [`col-xs-${width || 12}`];
      if (this.enableAdd) classes.push('insertable');
      return classes;
    }
  },
  watch: {
    lastPosition: {
      handler(val) { this.nextPosition = val; },
      immediate: true
    }
  },
  components: { AddElement, Draggable, InlineActivator }
};
</script>

<style lang="scss" scoped>
/* Do not remove! Makes sure vuedraggable detects correct scrollable parent */
.list-group {
  padding: 10px 15px;
}

.list-item-container {
  &.insertable /deep/ {
    > .contained-content {
      margin: 0;
    }
  }

  &.sortable-drag {
    margin: 10px 0;
    padding: 0;

    /deep/ .inline-activator {
      display: none;
    }
  }
}
</style>
