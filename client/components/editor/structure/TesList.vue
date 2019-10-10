<template>
  <div
    :class="{ 'embeded-elements': embedded }"
    class="list-group">
    <draggable
      @start="dragElementIndex = $event.oldIndex"
      @end="dragElementIndex = -1"
      @update="$emit('update', $event)"
      :list="list"
      :options="options"
      class="row">
      <div
        v-for="(item, index) in list"
        :key="item._cid || item.id"
        :class="getContainerClasses(item)"
        class="list-item-container">
        <inline-activator
          v-if="enableAdd && !embedded"
          @click.native="showElementDrawer(index - 1)" />
        <slot
          :item="item"
          :setWidth="false"
          :dragged="dragElementIndex === index"
          name="list-item">
        </slot>
      </div>
    </draggable>
    <div class="add-element-container mt-5">
      <add-element
        v-if="enableAdd"
        @hidden="onHiddenElementDrawer"
        @add="addElement"
        :include="types"
        :activity="activity"
        :position="insertPosition"
        :layout="layout"
        :show="isElementDrawerVisible"
        :large="!embedded"
        :icon="embedded ? 'mdi-plus' : 'mdi-pencil-plus'" />
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
    layout: { type: Boolean, default: false },
    embedded: { type: Boolean, default: false }
  },
  data() {
    return {
      dragElementIndex: -1,
      insertPosition: 0,
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
    }
  },
  methods: {
    showElementDrawer(position) {
      this.insertPosition = position;
      this.isElementDrawerVisible = true;
    },
    onHiddenElementDrawer() {
      this.isElementDrawerVisible = false;
      this.insertPosition = this.lastPosition;
    },
    getContainerClasses({ data: { width } }) {
      const classes = [`col-xs-${width || 12}`];
      if (this.enableAdd) classes.push('insertable');
      return classes;
    },
    addElement(element) {
      const type = element.position === this.lastPosition ? 'add' : 'insert';
      this.$emit(type, element);
    }
  },
  watch: {
    lastPosition: {
      handler(val) { this.insertPosition = val; },
      immediate: true
    }
  },
  components: { AddElement, Draggable, InlineActivator }
};
</script>

<style lang="scss" scoped>
.embeded-elements ::v-deep .contained-content {
  margin: 7px 0 !important;
}

/* Do not remove! Makes sure vuedraggable detects correct scrollable parent */
.list-group {
  padding: 10px 15px;
}

.list-item-container {
  &.insertable ::v-deep {
    > .contained-content {
      margin: 0;
    }
  }

  &.sortable-drag {
    margin: 10px 0;
    padding: 0;

    ::v-deep .inline-activator {
      display: none;
    }
  }
}
</style>
