<template>
  <div class="mb-5">
    <div class="actions">
      <v-btn
        @click="deleteContainer"
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
      :list="teachingElements"
      :activity="container"
      :types="types"
      :layout="layout"
      @add="addElement"
      @insert="insert"
      @update="reorder">
      <teaching-element
        slot="list-item"
        slot-scope="{ item, dragged, setWidth }"
        :setWidth="setWidth"
        :dragged="dragged"
        :element="item"/>
    </tes-list>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex-module';
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
    ...mapActions({
      reorderElements: 'reorder',
      insertElement: 'insert',
      addElement: 'save'
    }, 'tes'),
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
