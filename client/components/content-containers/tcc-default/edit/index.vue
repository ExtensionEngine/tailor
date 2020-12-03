<template>
  <v-sheet class="content-container mb-5 elevation-1">
    <div class="d-flex justify-end">
      <v-btn @click="$emit('delete')" color="pink" text>Delete {{ name }}</v-btn>
    </div>
    <v-alert
      :value="!containerElements.length"
      color="blue-grey darken-3"
      icon="mdi-information-variant"
      text prominent
      class="my-5 mx-3">
      Click the button below to create content.
    </v-alert>
    <element-list
      @update="reorder"
      :elements="containerElements"
      :activity="container"
      :supported-types="types"
      :layout="layout"
      class="element-list">
      <template v-slot:list-item="{ element, isDragged, position }">
        <inline-activator @click.native="showElementDrawer(position - 1)" />
        <contained-content
          @save="saveElement(element, 'data', $event)"
          v-bind="{ element, isDragged, setWidth: false }" />
      </template>
      <template v-slot:list-add="{ position: lastPosition, ...slotProps }">
        <div class="add-element-container mt-5">
          <add-element
            @add="addElement($event, lastPosition)"
            @hidden="onHiddenElementDrawer"
            v-bind="slotProps"
            :position="Math.min(insertPosition, lastPosition)"
            :show="isElementDrawerVisible"
            icon="mdi-toy-brick-plus"
            large />
        </div>
      </template>
    </element-list>
  </v-sheet>
</template>

<script>
import AddElement from 'tce-core/AddElement';
import ContainedContent from 'tce-core/ContainedContent';
import ElementList from 'tce-core/ElementList';
import filter from 'lodash/filter';
import InlineActivator from 'tce-core/AddElement/InlineActivator';
import InsertLocation from '@/utils/InsertLocation';
import sortBy from 'lodash/sortBy';

const { ADD_AFTER } = InsertLocation;

export default {
  name: 'tcc-default',
  props: {
    name: { type: String, required: true },
    container: { type: Object, required: true },
    elements: { type: Object, required: true },
    types: { type: Array, default: null },
    layout: { type: Boolean, default: true }
  },
  data: () => ({
    insertPosition: Infinity,
    isElementDrawerVisible: false
  }),
  computed: {
    id: vm => vm.container.id,
    containerElements() {
      return sortBy(filter(this.elements, { activityId: this.id }), 'position');
    }
  },
  methods: {
    reorder({ newPosition }) {
      this.$emit('reorderElement', { items: this.containerElements, newPosition });
    },
    showElementDrawer(position) {
      this.insertPosition = position;
      this.isElementDrawerVisible = true;
    },
    onHiddenElementDrawer() {
      this.isElementDrawerVisible = false;
      this.insertPosition = Infinity;
    },
    addElement(element, lastPosition) {
      if (element.position === lastPosition) {
        return this.$emit('saveElement', element);
      }
      const items = this.containerElements;
      const { position: newPosition } = element;
      const isFirstChild = newPosition === -1;
      const context = { items, newPosition, isFirstChild, action: ADD_AFTER };
      this.$emit('insertElement', { element, context });
    },
    saveElement(element, key, data) {
      element = {
        ...(element),
        [key]: data
      };
      this.$emit('saveElement', element);
    }
  },
  components: { AddElement, ContainedContent, ElementList, InlineActivator }
};
</script>

<style lang="scss" scoped>
.element-list ::v-deep .contained-content {
  margin: 0;
}

.element-list .sortable-drag {
  margin: 0.625rem 0;
  padding: 0;

  ::v-deep .inline-activator {
    display: none;
  }
}
</style>
