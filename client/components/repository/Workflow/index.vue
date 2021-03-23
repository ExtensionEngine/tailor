<template>
  <div class="workflow d-flex flex-column pt-3 pb-5 px-2">
    <v-progress-circular
      v-if="showLoader"
      color="primary"
      indeterminate
      class="align-self-center" />
    <template v-else>
      <workflow-filters
        v-bind.sync="filters"
        :assignee-options="assignees"
        :status-options="statusOptions"
        :show-unassigned="unassignedActivityExists"
        class="controls mx-4" />
      <workflow-overview :activities="filteredActivities" class="overview mt-3 mx-4" />
      <sidebar />
    </template>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import conforms from 'lodash/conforms';
import isAfter from 'date-fns/isAfter';
import overEvery from 'lodash/overEvery';
import Sidebar from './Sidebar';
import sub from 'date-fns/sub';
import WorkflowFilters from './Filters';
import WorkflowOverview from './Overview';

const RECENCY_THRESHOLD = { days: 2 };
const SEARCH_TEXT_LENGTH_THRESHOLD = 2;

export default {
  name: 'workflow-view',
  props: {
    showLoader: { type: Boolean, default: false }
  },
  data: () => ({
    filters: {
      searchText: null,
      status: null,
      selectedAssigneeIds: [],
      unassigned: false,
      recentOnly: false
    }
  }),
  computed: {
    ...mapGetters('repository', {
      workflow: 'workflow',
      activities: 'workflowActivities'
    }),
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
      const statusFilters = [
        this.filters.status && this.filterByStatus,
        this.isFilteredByAssignee && this.filterByAssignee,
        this.filters.recentOnly && this.filterByRecency
      ].filter(Boolean);

      return this.searchableActivities.filter(conforms({
        ...statusFilters.length && { status: overEvery(statusFilters) },
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
    },
    statusOptions() {
      const { statuses } = this.workflow;
      return statuses.map(it => ({ ...it, value: it.id, text: it.label }));
    }
  },
  methods: {
    ...mapActions('repository', ['getUsers']),
    filterByAssignee({ assigneeId }) {
      if (this.filters.unassigned && !assigneeId) return true;
      return this.filters.selectedAssigneeIds.includes(assigneeId);
    },
    filterByRecency({ updatedAt }) {
      const parsed = new Date(updatedAt);
      const updatedAtLimit = sub(new Date(), RECENCY_THRESHOLD);
      return isAfter(parsed, updatedAtLimit);
    },
    filterBySearchText(searchableText) {
      return searchableText.includes(this.filters.searchText.toLowerCase());
    },
    filterByStatus({ status }) {
      return status === this.filters.status;
    },
    getSearchableText({ data, shortId, status }) {
      const { name } = data;
      const { description } = status;
      return `${shortId} ${name} ${description}`.toLowerCase();
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
  max-width: calc(100% - #{$sidebar-width} - 3rem);
}

.overview {
  overflow-y: scroll;
}
</style>
