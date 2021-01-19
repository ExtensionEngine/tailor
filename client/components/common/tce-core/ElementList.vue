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
        :key="getElementId(element)"
        @dragstart="onDragStart(index)"
        @dragend="onDragEnd(element)"
        :class="`col-xs-${get(element, 'data.width', 12)}`"
        class="pr-5">
        <slot
          :element="element"
          :is-dragged="dragElementIndex === index"
          :position="index"
          name="list-item">
        </slot>
      </div>
    </draggable>
    <template v-if="enableAdd">
      <slot
        :include="supportedTypes"
        :activity="activity"
        :position="nextPosition"
        :layout="layout"
        name="list-add">
        <add-element
          @add="el => $emit('add', el)"
          :include="supportedTypes"
          :activity="activity"
          :label="addElementOptions.label"
          :large="addElementOptions.large"
          :position="nextPosition"
          :layout="layout"
          class="mt-1" />
      </slot>
    </template>
  </div>
</template>

<script>
import AddElement from './AddElement';
import Draggable from 'vuedraggable';
import get from 'lodash/get';
import { getElementId } from 'tce-core/utils';
import last from 'lodash/last';
import { mapChannels } from '@/plugins/radio';

const CE_FOCUS_EVENT = 'element:focus';

export default {
  name: 'element-list',
  props: {
    elements: { type: Array, default: () => [] },
    dragOptions: { type: Object, default: () => ({}) },
    supportedTypes: { type: Array, default: null },
    activity: { type: Object, default: null },
    layout: { type: Boolean, default: false },
    enableAdd: { type: Boolean, default: true },
    addElementOptions: { type: Object, default: () => ({}) }
  },
  data: () => ({ dragElementIndex: null }),
  computed: {
    ...mapChannels({ editorChannel: 'editor' }),
    options: vm => ({
      ...vm.dragOptions,
      handle: '.drag-handle'
    }),
    nextPosition() {
      const lastItem = last(this.elements);
      return lastItem ? lastItem.position + 1 : 1;
    }
  },
  methods: {
    get,
    getElementId,
    onDragStart(index) {
      this.dragElementIndex = index;
      this.editorChannel.emit(CE_FOCUS_EVENT);
    },
    onDragEnd(element) {
      this.dragElementIndex = -1;
      this.editorChannel.emit(CE_FOCUS_EVENT, element);
    },
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
  padding: 0.625rem 1.5rem;
}

::v-deep .sortable-ghost {
  .drag-handle {
    display: none;
  }

  .content-element {
    max-height: 9.375rem;
    background: #f4f5f5;

    & > * {
      visibility: hidden;
    }
  }
}

::v-deep .sortable-drag .content-element {
  max-height: auto;
  background: #fff;
}

</style>
