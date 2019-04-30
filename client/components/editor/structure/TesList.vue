<template>
  <div
    :class="{ 'embeded-elements': embedded }"
    class="list-group">
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
          v-if="enableAdd && !embedded"
          @click.native="showElementDrawer(index - 1)"/>
        <slot
          :item="item"
          :setWidth="false"
          :dragged="dragElementIndex === index"
          name="list-item"/>
      </div>
    </draggable>
    <div class="add-element-container mt-5">
      <add-element
        v-if="enableAdd"
        :include="types"
        :activity="activity"
        :layout="layout"
        :show="isElementDrawerVisible"
        :large="!embedded"
        :icon="embedded ? 'mdi-plus' : 'mdi-pencil-plus'"
        @hidden="onHiddenElementDrawer"
        @add="insertElement"/>
    </div>
  </div>
</template>

<script>
import AddElement from 'tce-core/AddElement';
import Draggable from 'vuedraggable';
import InlineActivator from './InlineActivator';

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
      insertPosition: null,
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
    }
  },
  methods: {
    showElementDrawer(position) {
      this.insertPosition = position;
      this.isElementDrawerVisible = true;
    },
    onHiddenElementDrawer() {
      this.isElementDrawerVisible = false;
      this.insertPosition = null;
    },
    getContainerClasses({ data: { width } }) {
      let classes = [`col-xs-${width || 12}`];
      if (this.enableAdd) classes.push('insertable');
      return classes;
    },
    insertElement(element) {
      let { insertPosition: position, list } = this;
      if (!Number.isInteger(position)) position = list.length - 1;
      this.$emit('insert', { ...element, position });
      this.insertPosition = null;
    }
  },
  components: { AddElement, Draggable, InlineActivator }
};
</script>

<style lang="scss" scoped>
.embeded-elements /deep/ .contained-content {
  margin: 7px 0 !important;
}

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
