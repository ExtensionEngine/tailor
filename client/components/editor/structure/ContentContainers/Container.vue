<template>
  <div class="content-container mb-5 elevation-2">
    <div class="actions">
      <v-btn
        @click="$emit('delete')"
        color="error"
        outline
        class="pull-right">
        Delete {{ name }}
      </v-btn>
    </div>
    <v-alert
      :value="!teachingElements.length"
      color="primary"
      icon="mdi-information-variant"
      outline>
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
  </div>
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
    ...mapActions('tes', {
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
  min-height: 36px;
  margin-bottom: 25px;
}
</style>
