<template>
  <div class="board d-flex flex-column grey lighten-4 py-3">
    <v-progress-circular v-if="showLoader" color="primary" indeterminate class="align-self-center" />
    <template v-else>
      <board-filters
        v-bind.sync="filters"
        :assignee-options="assignees"
        :show-unassigned="unassignedTaskExists" />
      <board-columns :tasks="filteredTasks" />
      <sidebar />
    </template>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import BoardColumns from './Columns';
import BoardFilters from './Filters';
import conforms from 'lodash/conforms';
import isAfter from 'date-fns/isAfter';
import Sidebar from './Sidebar';
import sub from 'date-fns/sub';

const RECENCY_THRESHOLD = { days: 2 };
const SEARCH_TEXT_LENGTH_THRESHOLD = 3;

export default {
  name: 'workflow-board',
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
    ...mapGetters('repository', ['repository', 'tasks']),
    unassignedTaskExists: vm => vm.tasks.some(it => !it.assigneeId),
    searchableTasks() {
      return this.tasks.map(it => ({
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
    filteredTasks() {
      return this.searchableTasks.filter(conforms({
        ...this.filters.recentOnly && { updatedAt: this.filterByRecency },
        ...this.isFilteredByAssignee && { assigneeId: this.filterByAssignee },
        ...this.isFilteredBySearchText && { searchableText: this.filterBySearchText }
      }));
    },
    assignees() {
      return this.tasks.reduce((all, { assignee }) => {
        if (!assignee) return all;
        const isActive = this.filters.selectedAssigneeIds.includes(assignee.id);
        return { ...all, [assignee.id]: { ...assignee, isActive } };
      }, null);
    }
  },
  methods: {
    ...mapActions('repository', ['getUsers']),
    ...mapActions('repository/tasks', { getTasks: 'reset' }),
    filterByAssignee(id) {
      if (this.filters.unassigned && !id) return true;
      return this.filters.selectedAssigneeIds.includes(id);
    },
    filterByRecency(updatedAt) {
      const parsed = new Date(updatedAt);
      const updatedAtLimit = sub(new Date(), RECENCY_THRESHOLD);
      return isAfter(parsed, updatedAtLimit);
    },
    filterBySearchText(searchableText) {
      return searchableText.indexOf(this.filters.searchText.toLowerCase()) !== -1;
    },
    getSearchableText({ shortId, description, activity }) {
      const { name } = activity.data;
      return `${shortId} ${name} ${description}`.toLowerCase();
    }
  },
  created() {
    this.getTasks();
    this.getUsers();
  },
  components: { BoardFilters, BoardColumns, Sidebar }
};
</script>

<style lang="scss" scoped>
.board {
  position: relative;
  height: 100%;

  .v-progress-circular {
    margin-top: 7.5rem;
  }
}
</style>
