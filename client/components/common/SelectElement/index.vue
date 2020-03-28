<template>
  <tailor-dialog
    v-model="isVisible"
    @click:outside="close"
    header-icon="mdi-transit-connection-variant"
    width="650">
    <template v-slot:header>
      {{ heading || defaultHeading }}
    </template>
    <template v-slot:body>
      <select-activity
        v-if="!selectedActivity"
        @selected="showActivityElements($event)"
        :selected="selectedElements" />
      <div v-else>
        <select-element
          @toggle="toggleElementSelection($event)"
          :content-containers="contentContainers"
          :allowed-types="allowedTypes"
          :multiple="multiple"
          :selected="selectedElements"
          selectable />
      </div>
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
import { getDescendants } from 'client/utils/activity';
import { mapGetters } from 'vuex';
import SelectActivity from './SelectActivity';
import SelectElement from './ContentPreview';
import sortBy from 'lodash/sortBy';
import TailorDialog from '@/components/common/TailorDialog';

export default {
  props: {
    repositoryId: { type: Number, required: true },
    heading: { type: String, default: '' },
    selected: { type: Array, default: () => [] },
    multiple: { type: Boolean, default: true },
    allowedTypes: { type: Array, default: () => [] }
  },
  data: () => ({
    isVisible: false,
    selectedActivity: null,
    contentContainers: [],
    selectedElements: []
  }),
  computed: {
    ...mapGetters('repository', ['activities', 'structure']),
    defaultHeading: vm => `Select element${vm.multiple ? 's' : ''}`
  },
  methods: {
    showActivityElements(activity) {
      this.selectedActivity = activity;
      this.contentContainers = sortBy(
        getDescendants(this.activities, activity), 'position');
    },
    toggleElementSelection(element) {
      const existing = this.selectedElements.find(it => it.id === element.id);
      this.selectedElements = existing
        ? this.selectedElements.filter(it => it.id !== element.id)
        : [...this.selectedElements, element];
    },
    async save() {
      this.$element('selected', [...this.selectedElements]);
      this.close();
    },
    close() {
      this.selectedElements = [...this.selected];
      this.isVisible = false;
    }
  },
  watch: {
    isVisible(val) {
      if (!val) return;
      this.selectedElements = [...this.selected];
    }
  },
  components: { SelectActivity, SelectElement, TailorDialog }
};
</script>

<style lang="scss" scoped>
.v-list-item__action {
  display: flex;
  flex-direction: row;
}
</style>
