<template>
  <div class="content-containers">
    <h2 v-if="displayHeading" class="headline">{{ name | capitalize }}</h2>
    <v-alert
      :value="!containerGroup.length"
      color="blue-grey darken-4"
      icon="mdi-information-variant"
      prominent text>
      Click the button below to create first {{ name | capitalize }}.
    </v-alert>
    <component
      :is="containerName"
      v-for="(container, index) in containerGroup"
      :key="container.uid || container.id"
      @addElement="addElement"
      @updateElement="updateElement"
      @saveElement="saveContentElement"
      @deleteElement="requestElementDeletion"
      @insertElement="insertElement"
      @reorderElement="reorderContentElements"
      @addSubcontainer="save"
      @updateSubcontainer="update"
      @deleteSubcontainer="requestContainerDeletion"
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
      <v-btn @click="addContainer" color="blue-grey darken-3" text class="mt-4">
        <v-icon class="pr-2">mdi-plus</v-icon>
        Create {{ name }}
      </v-btn>
    </div>
  </div>
</template>

<script>
import { getContainerName, getElementId } from 'tce-core/utils';
import { mapActions, mapState } from 'vuex';
import capitalize from 'lodash/capitalize';
import get from 'lodash/get';
import { getContainerTemplateId } from 'shared/activities';
import isEmpty from 'lodash/isEmpty';
import { mapRequests } from '@/plugins/radio';
import maxBy from 'lodash/maxBy';
import throttle from 'lodash/throttle';

export default {
  name: 'content-containers',
  inheritAttrs: false,
  inject: ['$ccRegistry'],
  props: {
    containerGroup: { type: Array, default: () => ({}) },
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
    containerName() {
      const id = getContainerTemplateId(this);
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
      insertElement: 'insert',
      reorderElements: 'reorder'
    }),
    addContainer() {
      const { type, parentId, nextPosition: position } = this;
      this.save({ type, parentId, position });
    },
    saveContentElement(element) {
      return this.saveElement(element).then(() => {
        this.$radio.channel(`element:${getElementId(element)}`).emit('saved');
        this.showNotification();
      });
    },
    reorderContentElements({ newPosition, items }) {
      const element = items[newPosition];
      const isFirstChild = newPosition === 0;
      const context = { items, newPosition, isFirstChild };
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
    showNotification: throttle(function () {
      this.$snackbar.show('Element saved');
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
  width: 100%;
  min-height: 15.5rem;
  margin: 1.5rem 0;
  padding: 0.625rem;
  background-color: #fff;
}
</style>
