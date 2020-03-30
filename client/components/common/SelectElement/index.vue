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
      <select-element
        v-else
        @toggle="element => toggleElementSelection(element)"
        :selected="selectedElements"
        :content-containers="contentContainers"
        :allowed-types="allowedTypes"
        :multiple="multiple"
        selectable />
    </template>
    <template v-slot:actions>
      <v-btn
        v-if="selectedActivity"
        @click="selectedActivity = null"
        text outlined>
        <v-icon>mdi-arrow-left</v-icon> Back
      </v-btn>
      <v-btn @click="close" text class="ml-1">Cancel</v-btn>
      <v-btn @click="save" color="secondary" text>Save</v-btn>
    </template>
  </tailor-dialog>
</template>

<script>
import { getDescendants } from '@/utils/activity';
import { mapGetters } from 'vuex';
import SelectActivity from './SelectActivity';
import SelectElement from '@/components/common/ContentPreview';
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
    selectedElements: []
  }),
  computed: mapGetters('repository', ['activities']),
  methods: {
    showActivityElements(activity) {
      this.selectedActivity = activity;
      this.contentContainers = sortBy(
        getDescendants(this.activities, activity), 'position');
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
  components: { SelectActivity, SelectElement, TailorDialog }
};
</script>
