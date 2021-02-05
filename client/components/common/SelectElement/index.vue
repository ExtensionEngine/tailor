<template>
  <tailor-dialog
    @click:outside="close"
    :value="true"
    :header-icon="headerIcon"
    width="650"
    scrollable>
    <template v-slot:header>{{ heading }}</template>
    <template v-slot:body>
      <template v-if="!selected.activity">
        <select-repository
          @selected="selectRepository"
          :repository="selected.repository"
          :disabled="onlyCurrentRepo" />
        <v-progress-circular v-if="loadingContent" indeterminate class="mt-5" />
        <select-activity
          v-else
          @selected="showActivityElements"
          :activities="items.activities"
          :selected-elements="selected.elements" />
      </template>
      <template v-else>
        <v-btn
          v-if="toggleButton"
          @click="toggleSelectAll"
          outlined
          class="float-right mr-4 mb-2">
          <v-icon class="mr-2">mdi-{{ toggleButton.icon }}</v-icon>
          {{ toggleButton.label }}
        </v-btn>
        <v-progress-circular v-if="loadingContent" indeterminate class="mt-5" />
        <content-preview
          v-else
          @toggle="toggleElementSelection"
          @element:open="openInEditor"
          :content-containers="items.contentContainers"
          :selected="selected.elements"
          :allowed-types="allowedTypes"
          :multiple="multiple"
          selectable />
      </template>
    </template>
    <template v-slot:actions>
      <v-btn
        v-if="selected.activity"
        @click="deselectActivity"
        text outlined
        class="mr-2">
        <v-icon>mdi-arrow-left</v-icon> Back
      </v-btn>
      <v-btn @click="close" text class="ml-1">Cancel</v-btn>
      <v-btn @click="save" color="secondary" text>{{ submitLabel }}</v-btn>
    </template>
  </tailor-dialog>
</template>

<script>
import activitiesApi from '@/api/activity';
import contentElementApi from 'client/api/contentElement';
import ContentPreview from '@/components/common/ContentPreview';
import flatMap from 'lodash/flatMap';
import { getDescendants as getContainers } from '@/utils/activity';
import { getSupportedContainers } from 'shared/activities';
import loader from '@/components/common/loader';
import map from 'lodash/map';
import { mapGetters } from 'vuex';
import SelectActivity from './SelectActivity';
import SelectRepository from './SelectRepository';
import sortBy from 'lodash/sortBy';
import TailorDialog from '@/components/common/TailorDialog';

const getContainerTypes = type => map(getSupportedContainers(type), 'type');

const TOGGLE_BUTTON = {
  SELECT: { label: 'Select all', icon: 'checkbox-multiple-marked-outline' },
  DESELECT: { label: 'Deselect all', icon: 'checkbox-multiple-blank-outline' }
};

export default {
  name: 'select-element',
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
    selected: {
      repository: null,
      activity: null,
      elements: []
    },
    loadingContent: false
  }),
  computed: {
    ...mapGetters('repository', {
      currentRepository: 'repository',
      currentActivities: 'activities'
    }),
    allElementsSelected: vm => vm.selected.elements.length === vm.elements.length,
    processedContainers() {
      const { selected: { activity }, items: { activities } } = this;
      if (!activity || !activities.length) return [];
      const rootTypes = getContainerTypes(activity.type);
      return this.getActivityContainers(activity, activities, rootTypes);
    },
    elements() {
      const elements = flatMap(this.items.contentContainers, 'elements');
      if (!this.allowedTypes.length) return elements;
      return elements.filter(it => this.allowedTypes.includes(it.type));
    },
    toggleButton() {
      const { allElementsSelected, elements, multiple, selected } = this;
      if (!multiple || !selected.activity || !elements.length) return;
      const { SELECT, DESELECT } = TOGGLE_BUTTON;
      return allElementsSelected ? DESELECT : SELECT;
    }
  },
  methods: {
    getActivityContainers(activity, activities, rootTypes) {
      let containers = activities.filter(({ type, parentId }) => {
        return parentId === activity.id && rootTypes.includes(type);
      });
      containers = sortBy(containers, [
        it => rootTypes.indexOf(it.type), 'position', 'createdAt'
      ]);
      return containers.reduce((acc, container) => {
        const subcontainers = getContainers(activities, container);
        acc.push(container, ...sortBy(subcontainers, 'position'));
        return acc;
      }, []);
    },
    async showActivityElements(activity) {
      this.selected.activity = activity;
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
      const { selected: { elements } } = this;
      const existing = elements.find(it => it.id === element.id);
      this.selected.elements = existing
        ? elements.filter(it => it.id !== element.id)
        : elements.concat(element);
    },
    toggleSelectAll() {
      this.selected.elements = this.allElementsSelected ? [] : this.elements;
    },
    deselectActivity() {
      this.selected.activity = null;
      this.items.contentContainers = [];
      this.selected.elements = [...this.selected];
    },
    async selectRepository(repository) {
      const { currentActivities, currentRepository } = this;
      this.selected.repository = repository;
      this.deselectActivity();
      this.items.activities = currentRepository.id === repository.id
        ? currentActivities
        : await this.fetchActivities(repository);
    },
    fetchActivities: loader(function (repository) {
      return activitiesApi.getActivities(repository.id);
    }, 'loadingContent'),
    fetchElements: loader(function (containers) {
      const { id: repositoryId } = this.selected.repository;
      const queryOpts = { repositoryId, ids: containers.map(it => it.id) };
      return contentElementApi.fetch(queryOpts);
    }, 'loadingContent', 500),
    save() {
      this.$emit('selected', [...this.selected.elements]);
      this.close();
    },
    close() {
      this.$emit('close');
    },
    openInEditor(elementId) {
      const params = {
        activityId: this.selected.activity.id,
        repositoryId: this.selected.repository.id
      };
      const route = { name: 'editor', params, query: { elementId } };
      const { href } = this.$router.resolve(route);
      window.open(href, '_blank');
    }
  },
  created() {
    this.selected.elements = [...this.selected];
    this.selected.repository = this.currentRepository;
    this.items.activities = this.currentActivities;
  },
  components: { ContentPreview, SelectActivity, SelectRepository, TailorDialog }
};
</script>
