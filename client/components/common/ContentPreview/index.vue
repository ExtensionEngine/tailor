<template>
  <div>
    <v-alert v-if="!elements.length" type="warning">
      No available elements.
    </v-alert>
    <div v-for="container in processedContainers" :key="container.id">
      <content-element
        v-for="element in container.elements"
        :key="element.id"
        @toggle="$emit('toggle', element)"
        :element="element"
        :selectable="selectable"
        :is-selected="!!selectionMap[element.id]"
        :selection-disabled="isSelectionDisabled" />
    </div>
  </div>
</template>

<script>
import ContentElement from './Element';

export default {
  name: 'content-preview',
  props: {
    contentContainers: { type: Array, required: true },
    selectable: { type: Boolean, default: false },
    multiple: { type: Boolean, default: true },
    allowedTypes: { type: Array, default: () => [] },
    selected: { type: Array, default: () => [] }
  },
  computed: {
    isSelectionDisabled() {
      return this.selectable && !this.multiple && !!this.selected.length;
    },
    selectionMap() {
      return this.selected.reduce((acc, { id }) => (acc[id] = true), {});
    },
    processedContainers() {
      const { contentContainers: containers, allowedTypes } = this;
      return containers.map(container => ({
        ...container,
        elements: allowedTypes.length
          ? container.elements.filter(it => allowedTypes.includes(it.type))
          : container.elements
      }));
    },
    elements() {
      const { contentContainers: containers } = this;
      return containers.reduce((acc, it) => acc.concat(it.elements), []);
    }
  },
  components: { ContentElement }
};
</script>
