<template>
  <div class="board d-flex flex-column grey lighten-4">
    <div class="filters d-flex align-center px-4">
      <v-text-field
        v-model="searchText"
        class="search-field"
        prepend-inner-icon="mdi-magnify"
        placeholder="Search by ID or name" />
      <div v-if="assignees.length" class="ml-5 mr-3">
        <v-avatar
          v-for="{ id, isActive, imgUrl } in assignees"
          :key="`assignee-${id}`"
          @click="toggleAssignee(id)"
          :size="34"
          class="avatar grey white--text"
          :class="{ active: isActive }">
          <img :src="imgUrl">
        </v-avatar>
        <v-avatar
          @click="filterUnassigned = !filterUnassigned"
          :size="34"
          :class="{ active: filterUnassigned }"
          color="avatar grey lighten-3 white--text">
          <v-icon>mdi-account</v-icon>
        </v-avatar>
      </div>
      <v-btn
        @click="showRecentOnly = !showRecentOnly"
        :class="{ active: showRecentOnly }"
        class="mx-3 filters__btn text-capitalize"
        text>
        Recently updated
      </v-btn>
    </div>
    <div class="tasks">
      <div v-if="workflow" class="column-layout mt-4 mx-4 flex-grow-0">
        <h5
          v-for="status in workflow.statuses"
          :key="status.id"
          class="status-title pa-3 grey lighten-3 text-uppercase align-self-start">
          {{ status.label }}
        </h5>
      </div>
      <div v-if="workflow" class="columns column-layout mx-4 flex-grow-0">
        <draggable
          v-for="status in workflow.statuses"
          :key="status.id"
          @change="setTaskStatus($event, status.id)"
          :list="getTasksByStatus(status.id)"
          group="tasks"
          class="cards d-flex flex-column align-center grey lighten-3">
          <card
            v-for="task in getTasksByStatus(status.id)"
            :key="task.id"
            @click="selectTask"
            :task="task" />
        </draggable>
      </div>
    </div>
    <sidebar />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import Card from './Card';
import conforms from 'lodash/conforms';
import Draggable from 'vuedraggable';
import get from 'lodash/get';
import groupBy from 'lodash/groupBy';
import isAfter from 'date-fns/isAfter';
import selectTask from '../common/selectTask';
import Sidebar from './Sidebar';
import sub from 'date-fns/sub';
import uniqBy from 'lodash/uniqBy';
import xor from 'lodash/xor';

export default {
  name: 'workflow-board',
  mixins: [selectTask],
  data: () => ({
    filteredAssigneeIds: [],
    filterUnassigned: false,
    showRecentOnly: false,
    searchText: null
  }),
  computed: {
    ...mapGetters('repository', ['repository', 'workflow', 'tasks']),
    searchableTasks() {
      return this.tasks.map(it => ({
        ...it,
        searchableText: `${it.shortId} ${it.name}`.toLowerCase()
      }));
    },
    filteredTasks() {
      const filters = {};
      if (this.showRecentOnly) filters.updatedAt = this.filterByRecency;
      if (this.filteredAssigneeIds.length || this.filterUnassigned) {
        filters.assigneeId = this.filterByAssignee;
      }
      if (this.searchText && this.searchText.length > 3) {
        filters.searchableText = this.filterBySearchText;
      }
      return this.searchableTasks.filter(conforms(filters));
    },
    groupedTasks() {
      return groupBy(this.filteredTasks, 'status');
    },
    assignees() {
      const assignees = this.tasks.reduce((all, { assignee }) => {
        if (!assignee) return all;
        const isActive = this.filteredAssigneeIds.includes(assignee.id);
        return [...all, { ...assignee, isActive }];
      }, []);
      return uniqBy(assignees, 'id');
    }
  },
  methods: {
    ...mapActions('repository', ['getUsers']),
    ...mapActions('repository/tasks', { getTasks: 'fetch', updateTask: 'save' }),
    getTasksByStatus(statusId) {
      return get(this.groupedTasks, statusId, []);
    },
    toggleAssignee(id) {
      this.filteredAssigneeIds = xor(this.filteredAssigneeIds, [id]);
    },
    filterByAssignee(id) {
      if (this.filterUnassigned && !id) return true;
      return this.filteredAssigneeIds.includes(id);
    },
    filterByRecency(updatedAt) {
      const parsed = new Date(updatedAt);
      const recencyThreshold = { days: 2 };
      const updatedAtLimit = sub(new Date(), recencyThreshold);
      return isAfter(parsed, updatedAtLimit);
    },
    filterBySearchText(searchableText) {
      return searchableText.indexOf(this.searchText.toLowerCase()) !== -1;
    },
    setTaskStatus(update, status) {
      if (!update.added) return;
      const { element: task } = update.added;
      return this.updateTask({ ...task, status });
    }
  },
  created() {
    this.getTasks();
    this.getUsers();
  },
  components: { Card, Draggable, Sidebar }
};
</script>

<style lang="scss" scoped>
$sidebar-width: 435px;

.column-layout {
  display: grid;
  grid: auto / auto-flow 228px;
  width: max-content;
  gap: 0 1rem;
}

.board {
  position: relative;
  height: 100%;
}

.tasks {
  max-width: calc(100% - #{$sidebar-width});
  overflow-x: scroll;
}

.columns {
  overflow-y: scroll;
  overflow-x: hidden;
}

.cards {
  padding-bottom: 10rem;
}

.status-title {
  margin: 0;
}

.search-field {
  max-width: 400px;
}

.avatar.v-avatar {
  border: 2px solid;
  border-color: #fff !important;

  &:not(:first-of-type) {
    margin-left: -0.5rem;
  }

  &.active {
    box-shadow: var(--v-info-base) 0 0 0 2px;
  }

  &:hover {
    transform: scale(1.1);
    z-index: 1;
    cursor: pointer;
  }
}

.filters__btn {
  letter-spacing: inherit;

  &.active {
    background-color: #e3e7e8;
  }
}
</style>
