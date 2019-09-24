<template>
  <v-card class="mb-5">
    <div class="actions">
      <v-btn
        @click="deleteContainer"
        color="error"
        outlined
        class="float-right">
        Delete {{ name }}
      </v-btn>
    </div>
    <v-alert
      :value="!teachingElements.length"
      color="primary"
      icon="mdi-information-variant"
      outlined>
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
      <teaching-element
        slot="list-item"
        slot-scope="{ item, dragged, setWidth }"
        :set-width="setWidth"
        :dragged="dragged"
        :element="item" />
    </tes-list>
  </v-card>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import filter from 'lodash/filter';
import sortBy from 'lodash/sortBy';
import TeachingElement from '../../TeachingElement';
import TesList from '../TesList';

export default {
  name: 'content-container',
  props: {
    container: { type: Object, required: true },
    types: { type: Array, default: null },
    name: { type: String, required: true },
    layout: { type: Boolean, required: true }
  },
  computed: {
    ...mapGetters(['tes']),
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
    },
    deleteContainer() {
      this.$emit('delete');
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
