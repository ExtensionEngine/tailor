<template>
  <div>
    <div class="actions">
      <span class="pull-right">
        <span @click="deleteContainer" class="action">
          <span class="mdi mdi-delete"></span>
        </span>
      </span>
    </div>
    <div v-if="!teachingElements.length" class="well">
      Click the button below to Create content.
    </div>
    <tes-list
      :list="teachingElements"
      :activity="activity"
      :types="types"
      :layout="true"
      @add="saveElement"
      @update="reorder">
      <teaching-element
        slot="list-item"
        slot-scope="{ item, dragged }"
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
    activity: { type: Object, required: true },
    types: { type: Array, required: false }
  },
  computed: {
    ...mapGetters(['tes']),
    teachingElements() {
      const activityId = this.activity.id;
      return sortBy(filter(this.tes, { activityId }), 'position');
    }
  },
  methods: {
    ...mapActions({ reorderElements: 'reorder', saveElement: 'save' }, 'tes'),
    reorder({ newIndex: newPosition }) {
      const items = this.teachingElements;
      const element = items[newPosition];
      const isFirstChild = newPosition === 0;
      const context = { items, newPosition, isFirstChild };
      this.reorderElements({ element, context });
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
  color: #707070;
  font-size: 22px;

  .action {
    padding: 0 10px;
  }

  .action:hover {
    color: #444;
    cursor: pointer;
  }
}
</style>
