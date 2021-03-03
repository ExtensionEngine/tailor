<template>
  <v-sheet class="content-container mb-5 elevation-1">
    <div class="d-flex justify-end">
      <v-btn
        v-if="!isDisabled"
        @click="$emit('delete')"
        color="pink"
        text>
        Delete {{ name }}
      </v-btn>
    </div>
    <v-alert
      :value="!containerElements.length"
      color="primary darken-3"
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
      :is-disabled="isDisabled"
      class="element-list">
      <template v-slot:list-item="{ element, isDragged, position }">
        <inline-activator
          @click="showElementDrawer(position)"
          :disabled="isDisabled" />
        <contained-content
          @save="saveElement(element, 'data', $event)"
          @save:meta="saveElement(element, 'meta', $event)"
          @delete="$emit('delete:element', element)"
          v-bind="{ element, isDragged, isDisabled, setWidth: false }"
          show-discussion />
      </template>
      <template v-slot:list-add="{ position: lastPosition, ...slotProps }">
        <div class="add-element-container mt-5">
          <add-element
            @add="$emit('save:element', $event)"
            @hidden="onHiddenElementDrawer"
            v-bind="slotProps"
            :items="containerElements"
            :position="Math.min(insertPosition, lastPosition)"
            :show="!isDisabled && isElementDrawerVisible"
            icon="mdi-toy-brick-plus"
            large />
        </div>
      </template>
    </element-list>
  </v-sheet>
</template>

<script>
import {
  AddElement,
  ContainedContent,
  ElementList,
  InlineActivator
} from '@extensionengine/tce-components';
import filter from 'lodash/filter';
import sortBy from 'lodash/sortBy';

export default {
  name: 'tcc-default',
  props: {
    name: { type: String, required: true },
    container: { type: Object, required: true },
    elements: { type: Object, required: true },
    types: { type: Array, default: null },
    layout: { type: Boolean, default: true },
    isDisabled: { type: Boolean, default: false }
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
      this.$emit('reorder:element', { items: this.containerElements, newPosition });
    },
    showElementDrawer(position) {
      this.insertPosition = position;
      this.isElementDrawerVisible = true;
    },
    onHiddenElementDrawer() {
      this.isElementDrawerVisible = false;
      this.insertPosition = Infinity;
    },
    saveElement(element, key, data) {
      this.$emit('save:element', {
        ...(element),
        [key]: data
      });
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
