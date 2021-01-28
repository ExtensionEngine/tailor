<template>
  <div class="workflow d-flex flex-column grey lighten-4 py-3">
    <v-progress-circular
      v-if="showLoader"
      color="primary"
      indeterminate
      class="align-self-center" />
    <template v-else>
      <div class="controls d-flex justify-space-between align-center pr-4">
        <workflow-filters
          v-bind.sync="filters"
          :assignee-options="assignees"
          :show-unassigned="unassignedActivityExists"
          class="px-4" />
      </div>
      <workflow-overview :activities="filteredActivities" class="overview mt-3 px-4" />
      <sidebar />
    </template>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import conforms from 'lodash/conforms';
import isAfter from 'date-fns/isAfter';
import Sidebar from './Sidebar';
import sub from 'date-fns/sub';
import WorkflowFilters from './Filters';
import WorkflowOverview from './Overview';

const RECENCY_THRESHOLD = { days: 2 };
const SEARCH_TEXT_LENGTH_THRESHOLD = 3;

export default {
  name: 'workflow-view',
  props: {
    showLoader: { type: Boolean, default: false }
  },
  data: () => ({
    filters: {
      searchText: null,
      recentOnly: false,
      selectedAssigneeIds: [],
      unassigned: false
    }
  }),
  computed: {
    ...mapGetters('repository', { activities: 'workflowActivities' }),
    unassignedActivityExists: vm => vm.activities.some(it => !it.status.assigneeId),
    searchableActivities() {
      return this.activities.map(it => ({
        ...it,
        searchableText: this.getSearchableText(it)
      }));
    },
    isFilteredByAssignee() {
      const { selectedAssigneeIds, unassigned } = this.filters;
      return selectedAssigneeIds.length || unassigned;
    },
    isFilteredBySearchText() {
      return this.filters.searchText?.length > SEARCH_TEXT_LENGTH_THRESHOLD;
    },
    filteredActivities() {
      return this.searchableActivities.filter(conforms({
        ...this.filters.recentOnly && { status: this.filterByRecency },
        ...this.isFilteredByAssignee && { status: this.filterByAssignee },
        ...this.isFilteredBySearchText && { searchableText: this.filterBySearchText }
      }));
    },
    assignees() {
      return this.activities.reduce((all, { status }) => {
        const { assignee } = status;
        if (!assignee) return all;
        const isActive = this.filters.selectedAssigneeIds.includes(assignee.id);
        return { ...all, [assignee.id]: { ...assignee, isActive } };
      }, null);
    }
  },
  methods: {
    ...mapActions('repository', ['getUsers']),
    filterByAssignee({ assigneeId: id }) {
      if (this.filters.unassigned && !id) return true;
      return this.filters.selectedAssigneeIds.includes(id);
    },
    filterByRecency({ updatedAt }) {
      const parsed = new Date(updatedAt);
      const updatedAtLimit = sub(new Date(), RECENCY_THRESHOLD);
      return isAfter(parsed, updatedAtLimit);
    },
    filterBySearchText(searchableText) {
      return searchableText.indexOf(this.filters.searchText.toLowerCase()) !== -1;
    },
    getSearchableText({ data, shortId, status }) {
      const { description } = status;
      return `${shortId} ${data.name} ${description}`.toLowerCase();
    }
  },
  created() {
    this.getUsers();
  },
  components: { Sidebar, WorkflowFilters, WorkflowOverview }
};
</script>

<style lang="scss" scoped>
$sidebar-width: 27.1875rem;

.workflow {
  position: relative;
  height: 100%;

  .v-progress-circular {
    margin-top: 7.5rem;
  }
}

.controls, .overview {
  max-width: calc(100% - #{$sidebar-width} - 1rem);
}
</style>
