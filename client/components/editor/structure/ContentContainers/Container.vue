<template>
  <div>
    <div class="actions">
      <button
        @click="deleteContainer"
        class="btn btn-default btn-material pull-right"
        type="button">
        <span class="mdi mdi-delete"></span>
        Delete {{ name }}
      </button>
    </div>
    <div v-if="!teachingElements.length" class="well">
      Click the button below to create content.
    </div>
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
        :element="item">
      </teaching-element>
    </tes-list>
  </div>
</template>

<script>
import filter from 'lodash/filter';
import { mapActions, mapGetters } from 'vuex-module';
import sortBy from 'lodash/sortBy';
import TeachingElement from '../../teaching-elements';
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
  color: #707070;
  font-size: 22px;

  .btn {
    color: #707070;
    border: 1px solid #f0f0f0;
    border-radius: 2px;
    outline: none;
    box-shadow: none;
  }
}
</style>
