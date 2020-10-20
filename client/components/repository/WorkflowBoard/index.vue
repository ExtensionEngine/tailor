<template>
  <div class="board d-flex flex-column grey lighten-4 py-3">
    <board-filters
      v-bind.sync="filters"
      :assignee-options="assignees"
      :show-unassigned="unassignedTaskExists" />
    <div class="tasks">
      <div v-if="workflow" class="column-layout mt-4 px-4">
        <h5
          v-for="status in workflow.statuses"
          :key="status.id"
          class="status-title align-self-start pa-3 grey lighten-3 text-uppercase">
          {{ status.label }}
        </h5>
      </div>
      <div v-if="workflow" class="column-layout px-4">
        <board-column
          v-for="status in workflow.statuses"
          :key="status.id"
          :tasks="groupedTasksByStatus"
          :status="status"
          class="cards" />
      </div>
    </div>
    <sidebar />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import BoardColumn from './Column';
import BoardToolbar from './Toolbar';
import conforms from 'lodash/conforms';
import groupBy from 'lodash/groupBy';
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
    ...mapGetters('repository', ['repository', 'workflow', 'tasks']),
    unassignedTaskExists: vm => vm.tasks.some(it => !it.assigneeId),
    searchableTasks() {
      return this.tasks.map(it => ({
        ...it,
        searchableText: `${it.shortId} ${it.name}`.toLowerCase()
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
    groupedTasksByStatus: vm => groupBy(vm.filteredTasks, 'status'),
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
    }
  },
  created() {
    this.getTasks();
    this.getUsers();
  },
  components: { BoardFilters, BoardColumn, Sidebar }
};
</script>

<style lang="scss" scoped>
$sidebar-width: 27.1875rem;

.column-layout {
  display: grid;
  grid: auto / auto-flow minmax(16rem, 25rem);
  gap: 0 0.75rem;
  width: fit-content;
}

.board {
  position: relative;
  height: 100%;
}

.tasks {
  max-width: calc(100% - #{$sidebar-width} - 1rem);
  overflow-x: scroll;
}

.cards {
  padding-bottom: 10rem;
}

.status-title {
  margin: 0;
}
</style>
