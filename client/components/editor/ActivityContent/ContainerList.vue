<template>
  <div class="content-containers">
    <h2 v-if="displayHeading" class="text-h5">{{ name | capitalize }}</h2>
    <v-alert
      :value="!containerGroup.length"
      color="primary darken-4"
      icon="mdi-information-variant"
      prominent text>
      Click the button below to create first {{ name | capitalize }}.
    </v-alert>
    <component
      :is="containerName"
      v-for="(container, index) in containerGroup"
      :key="container.uid || container.id"
      v-on="deprecatedListeners"
      @add:subcontainer="save"
      @update:subcontainer="update"
      @delete:subcontainer="requestContainerDeletion"
      @add:element="addElement"
      @save:element="saveContentElements"
      @update:element="updateElement"
      @reorder:element="reorderContentElements"
      @delete:element="requestElementDeletion"
      @delete="requestContainerDeletion(container)"
      :name="name"
      :container="container"
      :activities="processedActivities"
      :elements="processedElements"
      :tes="elements"
      :position="index"
      :is-disabled="showPublishDiff"
      v-bind="$attrs" />
    <div v-if="addBtnEnabled">
      <v-btn @click="addContainer" color="primary darken-3" text class="mt-4">
        <v-icon class="pr-2">mdi-plus</v-icon>
        Create {{ name }}
      </v-btn>
    </div>
  </div>
</template>

<script>
import { getContainerName, getElementId } from '@tailor-cms/utils';
import { mapActions, mapState } from 'vuex';
import capitalize from 'lodash/capitalize';
import castArray from 'lodash/castArray';
import deprecation from '@/components/common/mixins/deprecation';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import { mapRequests } from '@extensionengine/vue-radio';
import mapValues from 'lodash/mapValues';
import maxBy from 'lodash/maxBy';
import pluralize from 'pluralize';
import Promise from 'bluebird';
import throttle from 'lodash/throttle';

const DEPRECATED_LISTENERS = {
  addSubcontainer: { action: 'save' },
  updateSubcontainer: { action: 'update' },
  deleteSubcontainer: { action: 'requestContainerDeletion' },
  addElement: { action: 'addElement' },
  saveElement: { action: 'saveContentElements' },
  insertElement: {
    action: 'saveContentElements',
    newEvent: 'save:element',
    adaptArgs: ({ element, context }) => [{
      ...element, position: context.newPosition
    }]
  },
  updateElement: { action: 'updateElement' },
  reorderElement: { action: 'reorderContentElements' },
  deleteElement: { action: 'requestElementDeletion' }
};

export default {
  name: 'content-containers',
  mixins: [deprecation],
  inheritAttrs: false,
  inject: ['$schemaService', '$ccRegistry'],
  props: {
    containerGroup: { type: Array, default: () => [] },
    processedElements: { type: Object, required: true },
    processedActivities: { type: Object, required: true },
    type: { type: String, required: true },
    templateId: { type: String, default: null },
    parentId: { type: Number, required: true },
    label: { type: String, required: true },
    required: { type: Boolean, default: true },
    multiple: { type: Boolean, default: false },
    displayHeading: { type: Boolean, default: false }
  },
  computed: {
    ...mapState('repository/contentElements', { elements: 'items' }),
    ...mapState('editor', ['showPublishDiff']),
    deprecatedListeners() {
      return mapValues(DEPRECATED_LISTENERS, ({ action, ...config }, listener) => {
        return this.deprecateEvent(action, { oldEvent: listener, ...config });
      });
    },
    containerName() {
      const id = this.$schemaService.getContainerTemplateId(this);
      return getContainerName(this.$ccRegistry.get(id) ? id : 'DEFAULT');
    },
    name: vm => vm.label.toLowerCase(),
    addBtnEnabled() {
      const isMultipleOrEmpty = this.multiple || !this.containerGroup.length;
      return !this.showPublishDiff && isMultipleOrEmpty;
    },
    nextPosition() {
      const last = get(maxBy(this.containerGroup, 'position'), 'position', 0);
      return last + 1;
    }
  },
  methods: {
    ...mapRequests('app', ['showConfirmationModal']),
    ...mapActions('repository/activities', ['save', 'update', 'remove']),
    ...mapActions('repository/contentElements', {
      addElement: 'add',
      saveElement: 'save',
      updateElement: 'update',
      deleteElement: 'remove',
      reorderElements: 'reorder'
    }),
    addContainer() {
      const { type, parentId, nextPosition: position } = this;
      this.save({ type, parentId, position });
    },
    saveContentElements(elements) {
      // TODO: implement endpoint to save multiple elements at once
      const contentElements = castArray(elements);
      return Promise.map(contentElements, element => this.persistElement(element))
        .then(() => {
          const message = `${pluralize('Element', contentElements.length)} saved`;
          this.showNotification(message);
        });
    },
    persistElement(element) {
      const elementChannel = this.$radio.channel(`element:${getElementId(element)}`);
      return this.saveElement(element)
        .then(() => elementChannel.emit('saved'))
        .catch(err => {
          elementChannel.emit('error', err);
          return Promise.reject(err);
        });
    },
    reorderContentElements({ newPosition, items }) {
      const element = items[newPosition];
      const context = { items, newPosition };
      this.reorderElements({ element, context });
    },
    requestDeletion(content, action, name, onDelete = () => null) {
      this.showConfirmationModal({
        title: `Delete ${name}?`,
        message: `Are you sure you want to delete ${name}?`,
        action: () => this[action](content).then(onDelete)
      });
    },
    requestContainerDeletion(container, name = this.name) {
      this.requestDeletion(container, 'remove', name);
    },
    requestElementDeletion(element) {
      const onDelete = () => this.$emit('focusoutElement');
      this.requestDeletion(element, 'deleteElement', 'element', onDelete);
    },
    showNotification: throttle(function (message) {
      this.$snackbar.show(message);
    }, 4000)
  },
  created() {
    if (this.required && isEmpty(this.containerGroup)) this.addContainer();
  },
  filters: {
    capitalize
  }
};
</script>

<style lang="scss" scoped>
.content-containers {
  margin: 4.375rem 0;
}

.headline {
  margin: 3.125rem 0 1.25rem;
  padding: 0;
  text-align: left;
}

.content-container {
  margin: 1.5rem 0;
  width: 100%;
  min-height: 15.5rem;
  padding: 0.625rem;
  background-color: #fff;
}
</style>
