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
      @update="reorder"
      :elements="contentElements"
      :activity="container"
      :supported-types="types"
      :layout="layout"
      class="element-list">
      <template v-slot:list-item="{ element, isDragged, position }">
        <inline-activator @click.native="showElementDrawer(position)" />
        <content-element v-bind="{ element, isDragged, setWidth: false }" />
      </template>
      <template v-slot:list-add="{ position: lastPosition, ...slotProps }">
        <div class="add-element-container mt-5">
          <add-element
            @add="onAddElements"
            @hidden="onHiddenElementDrawer"
            v-bind="slotProps"
            :items="contentElements"
            :position="Math.min(insertPosition, lastPosition)"
            :show="isElementDrawerVisible"
            :large="true"
            icon="mdi-toy-brick-plus" />
        </div>
      </template>
    </element-list>
  </v-card>
</template>

<script>
import AddElement from 'tce-core/AddElement';
import ContentElement from '@/components/editor/ContentElement';
import ElementList from 'tce-core/ElementList';
import filter from 'lodash/filter';
import InlineActivator from './InlineActivator';
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
  data: () => ({
    insertPosition: Infinity,
    isElementDrawerVisible: false
  }),
  computed: {
    contentElements() {
      const activityId = this.container.id;
      return sortBy(filter(this.elements, { activityId }), 'position');
    }
  },
  methods: {
    ...mapActions('repository/contentElements', {
      reorderElements: 'reorder',
      addElement: 'save'
    }),
    reorder({ newPosition }) {
      const items = this.contentElements;
      const element = items[newPosition];
      const context = { items, newPosition };
      this.reorderElements({ element, context });
    },
    showElementDrawer(position) {
      this.insertPosition = position;
      this.isElementDrawerVisible = true;
    },
    onHiddenElementDrawer() {
      this.isElementDrawerVisible = false;
      this.insertPosition = Infinity;
    },
    onAddElements(elements) {
      // TODO: add route for creating elements in batch
      elements.forEach(element => this.addElement(element));
    }
  },
  components: { AddElement, ContentElement, ElementList, InlineActivator }
};
</script>

<style lang="scss" scoped>
.actions {
  width: 100%;
  min-height: 2.25rem;
  margin-bottom: 0.5rem;
}

.element-list ::v-deep .contained-content {
  margin: 0;
}

.element-list .sortable-drag {
  margin: 0.625rem 0;
  padding: 0;

  ::v-deep .inline-activator {
    display: none;
  }
}
</style>
