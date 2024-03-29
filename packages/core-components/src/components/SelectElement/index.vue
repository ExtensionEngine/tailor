<template>
  <tailor-dialog
    @click:outside="close"
    :value="true"
    :header-icon="headerIcon"
    width="650"
    scrollable>
    <template #header>{{ heading }}</template>
    <template #body>
      <template v-if="!selection.activity">
        <select-repository
          @selected="selectRepository"
          :repository="selection.repository"
          :disabled="onlyCurrentRepo" />
        <v-progress-circular v-if="loadingContent" indeterminate class="mt-5" />
        <select-activity
          v-else
          @selected="showActivityElements"
          :activities="items.activities"
          :selected-elements="selection.elements" />
      </template>
      <template v-else>
        <div v-if="toggleButton" class="d-flex justify-end mb-2 px-4">
          <v-btn @click="toggleSelectAll" outlined>
            <v-icon class="mr-2">mdi-{{ toggleButton.icon }}</v-icon>
            {{ toggleButton.label }}
          </v-btn>
        </div>
        <v-progress-circular v-if="loadingContent" indeterminate class="mt-5" />
        <content-preview
          v-else
          @toggle="toggleElementSelection"
          @element:open="openInEditor"
          :content-containers="items.contentContainers"
          :selected="selection.elements"
          :allowed-types="allowedTypes"
          :multiple="multiple"
          selectable />
      </template>
    </template>
    <template #actions>
      <v-btn
        v-if="selection.activity"
        @click="deselectActivity"
        text outlined
        class="mr-2">
        <v-icon dense class="mr-2">mdi-arrow-left</v-icon>Back
      </v-btn>
      <v-btn @click="close" text class="ml-1">Cancel</v-btn>
      <v-btn @click="save" text class="mr-2">{{ submitLabel }}</v-btn>
    </template>
  </tailor-dialog>
</template>

<script>
import { activity as activityUtils } from '@tailor-cms/utils';
import ContentPreview from '../ContentPreview/index.vue';
import flatMap from 'lodash/flatMap';
import loader from '@/loader';
import map from 'lodash/map';
import SelectActivity from './SelectActivity.vue';
import SelectRepository from './SelectRepository.vue';
import sortBy from 'lodash/sortBy';
import TailorDialog from '../TailorDialog.vue';

const { getDescendants } = activityUtils;
const TOGGLE_BUTTON = {
  SELECT: { label: 'Select all', icon: 'checkbox-multiple-marked-outline' },
  DESELECT: { label: 'Deselect all', icon: 'checkbox-multiple-blank-outline' }
};

export default {
  name: 'select-element',
  inject: ['$schemaService', '$repository', '$api'],
  props: {
    selected: { type: Array, default: () => [] },
    heading: { type: String, required: true },
    allowedTypes: { type: Array, required: true },
    multiple: { type: Boolean, default: true },
    submitLabel: { type: String, default: 'Save' },
    headerIcon: { type: String, default: 'mdi-toy-brick-plus-outline' },
    onlyCurrentRepo: { type: Boolean, default: false }
  },
  data: () => ({
    items: {
      activities: [],
      contentContainers: []
    },
    selection: {
      repository: null,
      activity: null,
      elements: []
    },
    loadingContent: false
  }),
  computed: {
    currentRepository: vm => vm.$repository,
    allElementsSelected: vm => vm.selection.elements.length === vm.elements.length,
    rootContainerTypes() {
      const type = this.selection.activity?.type;
      return type && this.getContainerTypes(type);
    },
    processedContainers() {
      const { selection: { activity }, items: { activities } } = this;
      if (!activity || !activities.length) return [];
      const containers = sortBy(activities.filter(this.isRootContainer), [
        this.getTypePosition, 'position', 'createdAt'
      ]);
      return flatMap(containers, it => [it, ...this.getSubcontainers(it)]);
    },
    elements() {
      const elements = flatMap(this.items.contentContainers, 'elements');
      if (!this.allowedTypes.length) return elements;
      return elements.filter(it => this.allowedTypes.includes(it.type));
    },
    toggleButton() {
      const { allElementsSelected, elements, multiple, selection } = this;
      if (!multiple || !selection.activity || !elements.length) return;
      const { SELECT, DESELECT } = TOGGLE_BUTTON;
      return allElementsSelected ? DESELECT : SELECT;
    }
  },
  methods: {
    getContainerTypes(type) {
      return map(this.$schemaService.getSupportedContainers(type), 'type');
    },
    getTypePosition({ type }) {
      return this.rootContainerTypes.indexOf(type);
    },
    isRootContainer({ parentId, type }) {
      const { selection: { activity }, rootContainerTypes } = this;
      return parentId === activity.id && rootContainerTypes.includes(type);
    },
    getSubcontainers(container) {
      const { items: { activities } } = this;
      return sortBy(getDescendants(activities, container), 'position');
    },
    async showActivityElements(activity) {
      this.selection.activity = activity;
      const { processedContainers } = this;
      const elements = await this.fetchElements(processedContainers);
      this.items.contentContainers = processedContainers.map(container => {
        return this.assignElements(container, activity, elements);
      });
    },
    assignElements(container, activity, elements) {
      const containerElements = elements
          .filter(it => it.activityId === container.id)
          .map(element => ({ ...element, activity }));
      return { ...container, elements: sortBy(containerElements, 'position') };
    },
    toggleElementSelection(element) {
      const { selection: { elements } } = this;
      const existing = elements.find(it => it.id === element.id);
      this.selection.elements = existing
        ? elements.filter(it => it.id !== element.id)
        : elements.concat(element);
    },
    toggleSelectAll() {
      this.selection.elements = this.allElementsSelected ? [] : this.elements;
    },
    deselectActivity() {
      this.selection.activity = null;
      this.items.contentContainers = [];
      this.selection.elements = [...this.selected];
    },
    async selectRepository(repository) {
      const { currentRepository } = this;
      this.selection.repository = repository;
      this.deselectActivity();
      this.items.activities = currentRepository.id === repository.id
        ? currentRepository.activities
        : await this.fetchActivities(repository);
    },
    fetchActivities: loader(function (repository) {
      return this.$api.fetchActivities(repository.id);
    }, 'loadingContent'),
    fetchElements: loader(function (containers) {
      const { id: repositoryId } = this.selection.repository;
      const queryOpts = { repositoryId, ids: containers.map(it => it.id) };
      return this.$api.fetchContentElements(queryOpts);
    }, 'loadingContent', 500),
    save() {
      this.$emit('selected', [...this.selection.elements]);
      this.close();
    },
    close() {
      this.$emit('close');
    },
    openInEditor(elementId) {
      const params = {
        activityId: this.selection.activity.id,
        repositoryId: this.selection.repository.id
      };
      const route = { name: 'editor', params, query: { elementId } };
      const { href } = this.$router.resolve(route);
      window.open(href, '_blank');
    }
  },
  created() {
    this.selection.elements = [...this.selected];
    this.selection.repository = this.currentRepository;
    this.items.activities = this.currentRepository.activities;
  },
  components: { ContentPreview, SelectActivity, SelectRepository, TailorDialog }
};
</script>
