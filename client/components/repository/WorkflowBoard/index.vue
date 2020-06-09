<template>
  <div class="board d-flex flex-column grey lighten-4">
    <div class="filters d-flex align-center px-4">
      <v-text-field
        v-model="searchText"
        class="search-field"
        prepend-inner-icon="mdi-magnify"
        placeholder="Search by ID or name" />
      <div class="ml-5 mr-3">
        <v-avatar
          v-for="{ id, isActive, imgUrl } in assignees"
          :key="`assignee-${id}`"
          @click="toggleAssignee(id)"
          :size="34"
          class="avatar grey lighten2 white--text"
          :class="{ active: isActive }">
          <img :src="imgUrl">
        </v-avatar>
      </div>
      <v-btn
        @click="showRecentOnly = !showRecentOnly"
        :elevation="0"
        class="mx-3 filters__btn text-capitalize"
        :class="{ active: showRecentOnly }">
        Recently updated
      </v-btn>
    </div>
    <div v-if="workflow" class="layout mt-4 mx-4 flex-grow-0">
      <h5 v-for="status in workflow.statuses" :key="status.id" class="status-title pa-3 grey lighten-3 text-uppercase align-self-start">
        {{ status.label }}
      </h5>
    </div>
    <div v-if="workflow" class="columns mx-4 flex-grow-0">
      <div v-for="status in workflow.statuses" :key="status.id" class="cards d-flex flex-column align-center grey lighten-3">
        <card
          v-for="task in getTasksByStatus(status.id)"
          :key="task.id"
          @click="selectTask"
          :task="task" />
      </div>
    </div>
    <sidebar />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import Card from './Card';
import conforms from 'lodash/conforms';
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
    assigneesShown: [],
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
      if (this.assigneesShown.length) filters.assigneeId = this.filterByAssignee;
      if (this.showRecentOnly) filters.updatedAt = this.filterByRecency;
      if (this.searchText && this.searchText.length > 3) {
        filters.searchableText = this.filterBySearchText;
      }
      return this.searchableTasks.filter(conforms(filters));
    },
    groupedTasks() {
      return groupBy(this.filteredTasks, 'status');
    },
    assignees() {
      return uniqBy(this.tasks.map(it => ({
        ...it.assignee,
        isActive: this.assigneesShown.includes(it.assignee.id)
      })), 'id');
    }
  },
  methods: {
    ...mapActions('repository/tasks', ['fetch']),
    getTasksByStatus(statusId) {
      return get(this.groupedTasks, statusId, []);
    },
    toggleAssignee(id) {
      this.assigneesShown = xor(this.assigneesShown, [id]);
    },
    filterByAssignee(id) {
      return this.assigneesShown.includes(id);
    },
    filterByRecency(updatedAt) {
      const parsed = new Date(updatedAt);
      const recencyThreshold = { days: 2 };
      const updatedAtLimit = sub(new Date(), recencyThreshold);
      return isAfter(parsed, updatedAtLimit);
    },
    filterBySearchText(searchableText) {
      return searchableText.indexOf(this.searchText.toLowerCase()) !== -1;
    }
  },
  created() {
    this.fetch();
  },
  components: { Card, Sidebar }
};
</script>

<style lang="scss" scoped>
$sidebar-width: 435px;

%board-layout {
  display: grid;
  max-width: calc(100% - #{$sidebar-width});
  grid: auto / auto-flow 228px;
  gap: 0 1rem;
}

.board {
  position: relative;
  height: 100%;
  overflow: hidden;
}

.layout {
  @extend %board-layout;

  overflow-x: scroll;
}

.columns {
  @extend %board-layout;

  overflow-y: scroll;
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
    box-shadow: var(--v-info-base) 0 0 0 2px;
  }
}
</style>
