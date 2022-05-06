<template>
  <v-card class="content-container mb-5">
    <div class="actions">
      <v-btn
        @click="$emit('delete')"
        color="secondary darken-1"
        text
        class="pull-right">
        Delete {{ name }}
      </v-btn>
    </div>
    <v-alert
      :value="!contentElements.length"
      color="blue-grey darken-3"
      icon="mdi-information-variant"
      text
      prominent
      class="my-5 mx-3">
      Click the button below to create content.
    </v-alert>
    <element-list
      @add="addElements"
      @insert="insertElements"
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
import Promise from 'bluebird';
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
    ...mapActions('repository/contentElements', {
      reorderElements: 'reorder',
      insertElement: 'insert',
      addElement: 'save'
    }),
    addElements(data) {
      const elements = data.length ? data : [data];
      return Promise.each(elements, element => this.addElement(element));
    },
    reorder({ newIndex: newPosition }) {
      const items = this.contentElements;
      const element = items[newPosition];
      const isFirstChild = newPosition === 0;
      const context = { items, newPosition, isFirstChild };
      this.reorderElements({ element, context });
    },
    insertElements(data) {
      const elements = data.length ? data : [data];
      return Promise.each(elements, element => this.insert(element));
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
