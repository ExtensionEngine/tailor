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
          :element="item"
          :element-style="getElementStyle(item.contentId)">
          <div
            class="active-users-wrapper">
            <active-users
              v-if="getActiveUsers('element', item.contentId)"
              :users="getActiveUsers('element', item.contentId)"
              :size="26" />
          </div>
        </content-element>
      </template>
    </element-list>
  </v-card>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import ActiveUsers from 'components/common/ActiveUsers';
import ContentElement from '../../ContentElement';
import ElementList from '../ElementList';
import filter from 'lodash/filter';
import first from 'lodash/first';
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
    ...mapGetters('activeUsers', ['getActiveUsers']),
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
    },
    getElementStyle(elementId) {
      const activeUsers = this.getActiveUsers('element', elementId);
      if (!activeUsers.length) return;
      const { palette, imgUrl } = first(activeUsers);
      const color = palette[imgUrl ? 'border' : 'background'];
      return { boxShadow: `0 0 0 2px ${color}` };
    }
  },
  components: { ActiveUsers, ContentElement, ElementList }
};
</script>

<style lang="scss" scoped>
.actions {
  width: 100%;
  min-height: 2.25rem;
  margin-bottom: 0.5rem;
}

::v-deep .active-users-wrapper {
  position: absolute;
  right: -1.25rem;
  margin-top: 1rem;
  transition: all 0.5s ease;

  .active-users { margin-right: 0; }
}
</style>
