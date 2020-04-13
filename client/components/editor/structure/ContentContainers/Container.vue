<template>
  <v-card class="content-container mb-5">
    <div class="actions">
      <v-btn
        @click="$emit('delete')"
        color="error"
        text
        class="pull-right">
        Delete {{ name }}
      </v-btn>
    </div>
    <v-alert
      :value="!contentElements.length"
      color="primary darken-1"
      outlined
      class="my-5 mx-3">
      Click the button below to create content.
    </v-alert>
    <element-list
      @add="addElement"
      @insert="insert"
      @update="reorder"
      :list="contentElements"
      :activity="container"
      :types="types"
      :layout="layout">
      <template v-slot:list-item="{ item, dragged, setWidth }">
        <content-element
          :set-width="setWidth"
          :dragged="dragged"
          :element="item" />
      </template>
    </element-list>
  </v-card>
</template>

<script>
import ContentElement from '../../ContentElement';
import ElementList from '../ElementList';
import filter from 'lodash/filter';
import { mapActions } from 'vuex';
import sortBy from 'lodash/sortBy';

export default {
  name: 'content-container',
  props: {
    container: { type: Object, required: true },
    elements: { type: Object, required: true },
    types: { type: Array, default: null },
    name: { type: String, required: true },
    layout: { type: Boolean, default: true }
  },
  computed: {
    contentElements() {
      const activityId = this.container.id;
      return sortBy(filter(this.elements, { activityId }), 'position');
    }
  },
  methods: {
    ...mapActions('repository/elements', {
      reorderElements: 'reorder',
      insertElement: 'insert',
      addElement: 'save'
    }),
    reorder({ newIndex: newPosition }) {
      const items = this.contentElements;
      const element = items[newPosition];
      const isFirstChild = newPosition === 0;
      const context = { items, newPosition, isFirstChild };
      this.reorderElements({ element, context });
    },
    insert(element) {
      const items = this.contentElements;
      const { position: newPosition } = element;
      const isFirstChild = newPosition === -1;
      const context = { items, newPosition, isFirstChild, insert: true };
      this.insertElement({ element, context });
    }
  },
  components: { ContentElement, ElementList }
};
</script>

<style lang="scss" scoped>
.actions {
  width: 100%;
  min-height: 2.25rem;
  margin-bottom: 0.5rem;
}
</style>
