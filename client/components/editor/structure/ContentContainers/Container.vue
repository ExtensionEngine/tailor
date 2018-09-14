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
      @add="save"
      @addAtIndex="saveElementToIndex"
      @update="reorderElements">
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
    ...mapActions(['save', 'saveAtIndex', 'reorder'], 'tes'),
    reorderElements({ newIndex: newPosition }) {
      this.reorder({
        element: this.teachingElements[newPosition],
        context: this.getContext(newPosition)
      });
    },
    saveElementToIndex({ element, index }) {
      this.saveAtIndex({ element, context: this.getContext(index) });
    },
    deleteContainer() {
      this.$emit('delete');
    },
    getContext(index) {
      return {
        newPosition: index,
        items: this.teachingElements,
        isFirstChild: index === 0
      };
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
