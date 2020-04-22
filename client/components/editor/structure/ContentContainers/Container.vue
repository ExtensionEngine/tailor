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
      :value="!teachingElements.length"
      color="blue-grey darken-3"
      icon="mdi-information-variant"
      text prominent
      class="my-5 mx-3">
      Click the button below to create content.
    </v-alert>
    <tes-list
      @add="addElement"
      @insert="insert"
      @update="reorder"
      :list="teachingElements"
      :activity="container"
      :types="types"
      :layout="layout">
      <template v-slot:list-item="{ item, dragged, setWidth }">
        <teaching-element
          :set-width="setWidth"
          :dragged="dragged"
          :element="item" />
      </template>
    </tes-list>
  </v-card>
</template>

<script>
import filter from 'lodash/filter';
import { mapActions } from 'vuex';
import sortBy from 'lodash/sortBy';
import TeachingElement from '../../TeachingElement';
import TesList from '../TesList';

export default {
  name: 'content-container',
  props: {
    container: { type: Object, required: true },
    tes: { type: Object, required: true },
    types: { type: Array, default: null },
    name: { type: String, required: true },
    layout: { type: Boolean, default: true }
  },
  computed: {
    teachingElements() {
      const activityId = this.container.id;
      return sortBy(filter(this.tes, { activityId }), 'position');
    }
  },
  methods: {
    ...mapActions('repository/tes', {
      reorderElements: 'reorder',
      insertElement: 'insert',
      addElement: 'save'
    }),
    reorder({ newIndex: newPosition }) {
      const items = this.teachingElements;
      const element = items[newPosition];
      const isFirstChild = newPosition === 0;
      const context = { items, newPosition, isFirstChild };
      this.reorderElements({ element, context });
    },
    insert(element) {
      const items = this.teachingElements;
      const { position: newPosition } = element;
      const isFirstChild = newPosition === -1;
      const context = { items, newPosition, isFirstChild, insert: true };
      this.insertElement({ element, context });
    }
  },
  components: {
    TesList,
    TeachingElement
  }
};
</script>

<style lang="scss" scoped>
.actions {
  width: 100%;
  min-height: 2.25rem;
  margin-bottom: 0.5rem;
}
</style>
