<template>
  <div class="board d-flex flex-column grey lighten-4 py-3">
    <div class="d-flex align-center px-4">
      <v-text-field
        v-model="searchText"
        prepend-inner-icon="mdi-magnify"
        placeholder="Search by ID or name"
        clearable
        class="search-field" />
      <div v-if="assignees" class="ml-7 mr-3">
        <assignee-avatar
          v-for="{ id, isActive, ...assignee } in assignees"
          :key="`assignee-${id}`"
          @click="toggleAssignee(id)"
          v-bind="assignee"
          :class="[{ active: isActive }]"
          class="avatar" />
        <assignee-avatar
          v-if="unassignedTaskExists"
          @click="filterUnassigned = !filterUnassigned"
          :class="{ active: filterUnassigned }"
          class="avatar" />
      </div>
      <v-btn
        @click="showRecentOnly = !showRecentOnly"
        :class="{ active: showRecentOnly }"
        text
        class="btn-filters mx-1 text-capitalize">
        Recently updated
      </v-btn>
    </div>
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
import AssigneeAvatar from '@/components/repository/common/AssigneeAvatar';
import BoardColumn from './Column';
import conforms from 'lodash/conforms';
import groupBy from 'lodash/groupBy';
import isAfter from 'date-fns/isAfter';
import Sidebar from './Sidebar';
import sub from 'date-fns/sub';
import xor from 'lodash/xor';

const RECENCY_THRESHOLD = { days: 2 };
const SEARCH_TEXT_LENGTH_THRESHOLD = 3;

export default {
  name: 'workflow-board',
  data: () => ({
    filteredAssigneeIds: [],
    filterUnassigned: false,
    showRecentOnly: false,
    searchText: null
  }),
  computed: {
    ...mapGetters('repository', ['repository', 'workflow', 'tasks']),
    unassignedTaskExists: vm => !!vm.tasks.find(it => !it.assigneeId),
    searchableTasks() {
      return this.tasks.map(it => ({
        ...it,
        searchableText: `${it.shortId} ${it.name}`.toLowerCase()
      }));
    },
    isFilteredByAssignee() {
      return this.filteredAssigneeIds.length || this.filterUnassigned;
    },
    isFilteredBySearchText() {
      return this.searchText?.length > SEARCH_TEXT_LENGTH_THRESHOLD;
    },
    filteredTasks() {
      return this.searchableTasks.filter(conforms({
        ...this.showRecentOnly && { updatedAt: this.filterByRecency },
        ...this.isFilteredByAssignee && { assigneeId: this.filterByAssignee },
        ...this.isFilteredBySearchText && { searchableText: this.filterBySearchText }
      }));
    },
    groupedTasksByStatus: vm => groupBy(vm.filteredTasks, 'status'),
    assignees() {
      return this.tasks.reduce((all, { assignee }) => {
        if (!assignee) return all;
        const isActive = this.filteredAssigneeIds.includes(assignee.id);
        return { ...all, [assignee.id]: { ...assignee, isActive } };
      }, null);
    }
  },
  methods: {
    ...mapActions('repository', ['getUsers']),
    ...mapActions('repository/tasks', { getTasks: 'reset' }),
    toggleAssignee(id) {
      this.filteredAssigneeIds = xor(this.filteredAssigneeIds, [id]);
    },
    filterByAssignee(id) {
      if (this.filterUnassigned && !id) return true;
      return this.filteredAssigneeIds.includes(id);
    },
    filterByRecency(updatedAt) {
      const parsed = new Date(updatedAt);
      const updatedAtLimit = sub(new Date(), RECENCY_THRESHOLD);
      return isAfter(parsed, updatedAtLimit);
    },
    filterBySearchText(searchableText) {
      return searchableText.indexOf(this.searchText.toLowerCase()) !== -1;
    }
  },
  created() {
    this.getTasks();
    this.getUsers();
  },
  components: { BoardColumn, Sidebar, AssigneeAvatar }
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

.search-field {
  max-width: 17.5rem;
}

.avatar.v-avatar {
  border: 2px solid;
  border-color: #fff !important;

  &:not(:first-of-type) {
    margin-left: -0.5rem;
  }

  &.active {
    box-shadow: var(--v-secondary-base) 0 0 0 2px;
  }

  &:hover {
    transform: scale(1.1);
    z-index: 1;
    cursor: pointer;
  }
}

.btn-filters {
  letter-spacing: inherit;

  &.active {
    color: var(--v-secondary-darken1);
    background-color: var(--v-secondary-lighten5);
  }
}
</style>
