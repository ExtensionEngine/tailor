<template>
  <div
    :class="{ 'embeded-elements': embedded }"
    class="list-group">
    <draggable
      @start="dragElementIndex = $event.oldIndex"
      @end="dragElementIndex = -1"
      @update="$emit('update', $event)"
      :list="list"
      v-bind="options"
      class="row">
      <div
        v-for="(item, index) in list"
        :key="item._cid || item.id"
        :class="getContainerClasses(item)"
        class="list-item-container">
        <inline-activator
          v-if="enableAdd && !embedded"
          @click.native="openElementDrawer(index - 1)" />
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
        @add="insertElement"
        @hidden="onHiddenElementDrawer"
        :include="types"
        :activity="activity"
        :layout="layout"
        :show.sync="showElementDrawer"
        :large="!embedded"
        :icon="embedded ? 'mdi-plus' : 'mdi-pencil-plus'" />
    </div>
  </div>
</template>

<script>
import AddElement from 'tce-core/AddElement';
import Draggable from 'vuedraggable';
import InlineActivator from './InlineActivator';

const draggableConfig = {
  handle: '.drag-handle',
  scrollSpeed: 15,
  scrollSensitivity: 125
};

export default {
  props: {
    list: { type: Array, default: () => [] },
    dragOptions: { type: Object, default: () => ({}) },
    enableAdd: { type: Boolean, default: true },
    types: { type: Array, default: null },
    activity: { type: Object, required: true },
    layout: { type: Boolean, default: false },
    embedded: { type: Boolean, default: false }
  },
  data: () => ({
    dragElementIndex: -1,
    insertPosition: 0,
    showElementDrawer: false
  }),
  computed: {
    options: ({ dragOptions }) => ({ ...dragOptions, ...draggableConfig }),
    positionLimit: ({ list }) => list.length - 1
  },
  methods: {
    openElementDrawer(position) {
      this.insertPosition = position;
      this.showElementDrawer = true;
    },
    getContainerClasses({ data: { width } }) {
      const classes = [`col-xs-${width || 12}`];
      if (this.enableAdd) classes.push('insertable');
      return classes;
    },
    insertElement(element) {
      this.$emit('insert', { ...element, position: this.insertPosition });
    }
  },
  watch: {
    showElementDrawer: {
      handler(isOpen) {
        if (!isOpen) this.insertPosition = this.positionLimit;
        this.insertPosition = Math.min(this.insertPosition, this.positionLimit);
      },
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
