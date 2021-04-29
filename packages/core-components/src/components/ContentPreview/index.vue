<template>
  <div class="content-preview">
    <v-alert v-if="!elements.length" color="grey darken-4" text class="mx-4">
      No available elements.
    </v-alert>
    <div
      v-for="container in processedContainers"
      :key="container.id"
      class="content-container d-flex flex-wrap">
      <content-element
        v-for="element in container.elements"
        :key="element.id"
        @toggle="$emit('toggle', element)"
        @element:open="$emit('element:open', $event)"
        :element="element"
        :selectable="selectable"
        :is-selected="!!selectionMap[element.id]"
        :selection-disabled="isSelectionDisabled"
        is-disabled />
    </div>
  </div>
</template>

<script>
import ContentElement from './Element.vue';
import keyBy from 'lodash/keyBy';

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
    selectionMap: vm => keyBy(vm.selected, 'id'),
    processedContainers() {
      const { contentContainers: containers, allowedTypes } = this;
      if (!allowedTypes.length) return containers;
      return containers.map(container => ({
        ...container,
        elements: container.elements.filter(it => allowedTypes.includes(it.type))
      }));
    },
    elements() {
      const { processedContainers: containers } = this;
      return containers.reduce((acc, it) => acc.concat(it.elements), []);
    }
  },
  components: { ContentElement }
};
</script>

<style lang="scss" scoped>
.content-preview {
  .v-alert {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 19rem;
  }

  .content-container:last-child {
    margin-bottom: 0.625rem;
  }
}
</style>
