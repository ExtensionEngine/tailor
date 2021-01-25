<template>
  <tailor-dialog
    @click:outside="close"
    :value="true"
    :header-icon="headerIcon"
    width="650"
    scrollable>
    <template v-slot:header>{{ heading }}</template>
    <template v-slot:body>
      <template v-if="!selectedActivity">
        <select-repository
          @selected="selectRepository"
          :repository="repository"
          :disabled="useCurrentRepo" />
        <v-progress-circular v-if="loadingContent" indeterminate class="mt-5" />
        <select-activity
          v-else
          @selected="showActivityElements"
          :activities="activities"
          :selected-elements="selectedElements" />
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
          @element:open="openElement"
          :content-containers="contentContainers"
          :selected="selectedElements"
          :allowed-types="allowedTypes"
          :multiple="multiple"
          selectable />
      </template>
    </template>
    <template v-slot:actions>
      <v-btn
        v-if="selectedActivity"
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
import contentElementApi from 'client/api/contentElement';
import ContentPreview from '@/components/common/ContentPreview';
import flatMap from 'lodash/flatMap';
import { getDescendants as getContainers } from '@/utils/activity';
import { getSupportedContainers } from 'shared/activities';
import loader from '@/components/common/loader';
import map from 'lodash/map';
import { mapGetters } from 'vuex';
import repositoryApi from '@/api/repository';
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
    useCurrentRepo: { type: Boolean, default: false }
  },
  data: () => {
    return {
      repository: null,
      selectedActivity: null,
      contentContainers: [],
      selectedElements: [],
      loadingContent: false,
      activities: []
    };
  },
  computed: {
    ...mapGetters('repository', {
      currentRepository: 'repository',
      currentActivities: 'activities'
    }),
    allElementsSelected: vm => vm.selectedElements.length === vm.elements.length,
    showBackButton: vm => vm.useCurrentRepo ? !!vm.selectedActivity : !!vm.repository,
    containers() {
      const { selectedActivity, activities } = this;
      if (!selectedActivity || !activities.length) return [];
      const rootTypes = getContainerTypes(selectedActivity.type);
      let containers = activities.filter(({ type, parentId }) => {
        return parentId === selectedActivity.id && rootTypes.includes(type);
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
    elements() {
      const elements = flatMap(this.contentContainers, 'elements');
      if (!this.allowedTypes.length) return elements;
      return elements.filter(it => this.allowedTypes.includes(it.type));
    },
    toggleButton() {
      const { allElementsSelected, elements, multiple, selectedActivity } = this;
      if (!multiple || !selectedActivity || !elements.length) return;
      const { SELECT, DESELECT } = TOGGLE_BUTTON;
      return allElementsSelected ? DESELECT : SELECT;
    }
  },
  methods: {
    async showActivityElements(activity) {
      this.selectedActivity = activity;
      const { containers } = this;
      const elements = await this.fetchElements(containers);
      this.contentContainers = containers.map(container => {
        const containerElements = elements.filter(it => it.activityId === container.id);
        return { ...containers, elements: sortBy(containerElements, 'position') };
      });
    },
    assignActivity(element) {
      return { ...element, activity: this.selectedActivity };
    },
    toggleElementSelection(element) {
      const { selectedElements: elements } = this;
      const existing = elements.find(it => it.id === element.id);
      this.selectedElements = existing
        ? elements.filter(it => it.id !== element.id)
        : elements.concat(this.assignActivity(element));
    },
    toggleSelectAll() {
      this.selectedElements = this.allElementsSelected
        ? []
        : this.elements.map(this.assignActivity);
    },
    deselectActivity() {
      this.selectedActivity = null;
      this.contentContainers = [];
      this.selectedElements = [];
    },
    async selectRepository(repository) {
      const { currentActivities, currentRepository } = this;
      this.repository = repository;
      this.deselectActivity();
      this.activities = currentRepository.id === repository.id
        ? currentActivities
        : await this.fetchActivities(repository);
    },
    fetchActivities: loader(function (repository) {
      return repositoryApi.get(repository.id, { withActivities: true })
        .then(({ activities }) => activities);
    }, 'loadingContent'),
    fetchElements: loader(function (containers) {
      const { id: repositoryId } = this.repository;
      const queryOpts = { repositoryId, ids: containers.map(it => it.id) };
      return contentElementApi.fetch(queryOpts);
    }, 'loadingContent', 500),
    save() {
      this.$emit('selected', [...this.selectedElements]);
      this.close();
    },
    close() {
      this.$emit('close');
    },
    openElement(elementId) {
      const {
        selectedActivity: { id: activityId },
        repository: { id: repositoryId }
      } = this;
      const params = { activityId, repositoryId };
      const route = { name: 'editor', params, query: { elementId } };
      const { href } = this.$router.resolve(route);
      window.open(href, '_blank');
    }
  },
  created() {
    this.selectedElements = [...this.selected];
    this.repository = this.currentRepository;
    this.activities = this.currentActivities;
  },
  components: { ContentPreview, SelectActivity, SelectRepository, TailorDialog }
};
</script>
