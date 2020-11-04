<template>
  <div class="board d-flex flex-column grey lighten-4 py-3">
    <board-filters
      v-bind.sync="filters"
      :assignee-options="assignees"
      :show-unassigned="unassignedTaskExists" />
    <board-columns :tasks="filteredTasks" />
    <sidebar />
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
  data: () => ({
    filters: {
      searchText: null,
      assigneeIds: [],
      unassigned: false,
      recentOnly: false
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
      return this.filters.assigneeIds.length || this.filters.unassigned;
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
        const isActive = this.filters.assigneeIds.includes(assignee.id);
        return { ...all, [assignee.id]: { ...assignee, isActive } };
      }, null);
    }
  },
  methods: {
    ...mapActions('repository', ['getUsers']),
    ...mapActions('repository/tasks', { getTasks: 'reset' }),
    filterByAssignee(id) {
      if (this.filters.unassigned && !id) return true;
      return this.filters.assigneeIds.includes(id);
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
}
</style>
