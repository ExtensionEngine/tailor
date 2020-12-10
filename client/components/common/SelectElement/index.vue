<template>
  <tailor-dialog
    @click:outside="close"
    :value="true"
    :header-icon="headerIcon"
    width="650"
    scrollable>
    <template v-slot:header>{{ heading }}</template>
    <template v-slot:body>
      <v-btn
        v-if="toggleButton"
        @click="toggleSelectAll"
        outlined
        class="float-right mr-4 mb-2">
        <v-icon class="mr-2">mdi-{{ toggleButton.icon }}</v-icon>
        {{ toggleButton.label }}
      </v-btn>
      <select-repository v-if="!activities.length" @selected="selectRepository" />
      <select-activity
        v-else-if="!selectedActivity"
        @selected="activity => showActivityElements(activity)"
        :activities="activities"
        :selected-elements="selectedElements" />
      <v-progress-circular v-else-if="loadingContent" indeterminate class="mt-5" />
      <content-preview
        v-else
        @toggle="element => toggleElementSelection(element)"
        :content-containers="contentContainers"
        :selected="selectedElements"
        :allowed-types="allowedTypes"
        :multiple="multiple"
        selectable />
    </template>
    <template v-slot:actions>
      <v-btn
        v-if="showBackButton"
        @click="goBack"
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
import loader from '@/components/common/loader';
import { mapGetters } from 'vuex';
import repositoryApi from '@/api/repository';
import SelectActivity from './SelectActivity';
import SelectRepository from './SelectRepository';
import sortBy from 'lodash/sortBy';
import TailorDialog from '@/components/common/TailorDialog';

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
  data: vm => {
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
    elements() {
      const elements = flatMap(this.contentContainers, 'elements');
      if (!this.allowedTypes.length) return elements;
      return elements.filter(it => this.allowedTypes.includes(it.type));
    },
    toggleButton() {
      const {
        allElementsSelected, elements, loadingContent, multiple, selectedActivity
      } = this;
      if (!multiple || !selectedActivity || !elements.length || loadingContent) return;
      const { SELECT, DESELECT } = TOGGLE_BUTTON;
      return allElementsSelected ? DESELECT : SELECT;
    }
  },
  methods: {
    async showActivityElements(activity) {
      this.selectedActivity = activity;
      const { activities } = this;
      const containers = sortBy(getContainers(activities, activity), 'position');
      const elements = await this.fetchElements(containers);
      this.contentContainers = containers.map(container => ({
        ...container,
        elements: elements.filter(element => element.activityId === container.id)
      }));
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
    goBack() {
      if (this.selectedActivity) return this.deselectActivity();
      this.repository = null;
      this.activities = [];
    },
    deselectActivity() {
      this.selectedActivity = null;
      this.selectedElements = [];
    },
    selectRepository(repository) {
      const { currentActivities, currentRepository } = this;
      this.repository = repository;
      if (currentRepository.id === repository.id) {
        this.activities = currentActivities;
      } else {
        repositoryApi.get(repository.id, { withActivities: true })
          .then(({ activities }) => (this.activities = activities));
      }
    },
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
    }
  },
  created() {
    this.selectedElements = [...this.selected];
  },
  mounted() {
    if (this.useCurrentRepo) {
      this.repository = this.currentRepository;
      this.activities = this.currentActivities;
    }
  },
  components: { ContentPreview, SelectActivity, SelectRepository, TailorDialog }
};
</script>
