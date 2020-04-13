<template>
  <tailor-dialog
    @click:outside="close"
    :value="true"
    header-icon="mdi-transit-connection-variant"
    width="650">
    <template v-slot:header>{{ heading }}</template>
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
        @click="selectedActivity = null"
        text outlined
        class="mr-2">
        <v-icon>mdi-arrow-left</v-icon> Back
      </v-btn>
      <v-btn @click="close" text class="ml-1">Cancel</v-btn>
      <v-btn @click="save" color="secondary" text>Save</v-btn>
    </template>
  </tailor-dialog>
</template>

<script>
import contentElementApi from 'client/api/contentElement';
import ContentPreview from '@/components/common/ContentPreview';
import { getContentContainers as getContainers } from '@/utils/activity';
import { mapGetters } from 'vuex';
import Promise from 'bluebird';
import SelectActivity from './SelectActivity';
import sortBy from 'lodash/sortBy';
import TailorDialog from '@/components/common/TailorDialog';

export default {
  name: 'select-element',
  props: {
    selected: { type: Array, default: () => [] },
    heading: { type: String, required: true },
    multiple: { type: Boolean, default: true },
    allowedTypes: { type: Array, default: () => [] }
  },
  data: () => ({
    selectedActivity: null,
    contentContainers: [],
    selectedElements: [],
    loadingContent: false
  }),
  computed: mapGetters('repository', ['repository', 'activities']),
  methods: {
    async showActivityElements(activity) {
      this.selectedActivity = activity;
      this.loadingContent = true;
      const { activities } = this;
      const containers = sortBy(getContainers(activities, activity), 'position');
      const elements = await this.fetchElements(containers);
      this.contentContainers = containers.map(container => ({
        ...container,
        elements: elements.filter(element => element.activityId === container.id)
      }));
      this.loadingContent = false;
    },
    toggleElementSelection(element) {
      const { selectedActivity: activity, selectedElements: elements } = this;
      const elementLocation = {
        containerId: element.activityId,
        outlineId: activity.id
      };
      const existing = elements.find(it => it.id === element.id);
      this.selectedElements = existing
        ? elements.filter(it => it.id !== element.id)
        : [...elements, { id: element.id, ...elementLocation }];
    },
    fetchElements(containers) {
      const { repository: { id: repositoryId } } = this;
      const queryOpts = { repositoryId, ids: containers.map(it => it.id) };
      return Promise.all([
        contentElementApi.fetch(queryOpts),
        Promise.delay(500)]
      ).then(([elements]) => elements);
    },
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
