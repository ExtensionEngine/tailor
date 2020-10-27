<template>
  <tailor-dialog
    @click:outside="close"
    :value="true"
    :header-icon="headerIcon"
    width="650"
    scrollable>
    <template v-slot:header>
      {{ heading }}
      <v-btn
        v-if="selectedActivity && !loadingContent"
        @click="toggleSelectAll"
        text dark
        class="float-right">
        <v-icon class="mr-2">mdi-{{ toggleButton.icon }}</v-icon>
        {{ toggleButton.label }}
      </v-btn>
    </template>
    <template v-slot:body>
      <select-activity
        v-if="!selectedActivity"
        @selected="activity => showActivityElements(activity)"
        :selected-elements="selectedElements" />
      <v-progress-circular v-else-if="loadingContent" indeterminate class="mt-5" />
      <content-preview
        v-else
        @toggle="element => toggleElementSelection(element)"
        :content-containers="contentContainers"
        :selected="selectedElements"
        :heading="heading"
        :allowed-types="allowedTypes"
        :multiple="multiple"
        selectable />
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
import loader from '@/components/common/loader';
import { mapGetters } from 'vuex';
import SelectActivity from './SelectActivity';
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
    multiple: { type: Boolean, default: true },
    allowedTypes: { type: Array, default: () => [] },
    submitLabel: { type: String, default: 'Save' },
    headerIcon: { type: String, default: 'mdi-toy-brick-plus-outline' }
  },
  data: () => ({
    selectedActivity: null,
    contentContainers: [],
    selectedElements: [],
    loadingContent: false
  }),
  computed: {
    ...mapGetters('repository', ['repository', 'activities']),
    allElementsSelected: vm => vm.selectedElements.length === vm.elements.length,
    elements() {
      return flatMap(this.contentContainers, 'elements')
        .filter(it => this.allowedTypes.includes(it.type));
    },
    toggleButton() {
      const { SELECT, DESELECT } = TOGGLE_BUTTON;
      return this.allElementsSelected ? DESELECT : SELECT;
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
    toggleSelectAll() {
      this.selectedElements = this.allElementsSelected ? [] : [...this.elements];
    },
    toggleElementSelection(element) {
      const { selectedActivity: activity, selectedElements: elements } = this;
      const existing = elements.find(it => it.id === element.id);
      this.selectedElements = existing
        ? elements.filter(it => it.id !== element.id)
        : elements.concat({ ...element, activity });
    },
    deselectActivity() {
      this.selectedActivity = null;
      this.selectedElements = [];
    },
    fetchElements: loader(function (containers) {
      const { repository: { id: repositoryId } } = this;
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
  components: { ContentPreview, SelectActivity, TailorDialog }
};
</script>
