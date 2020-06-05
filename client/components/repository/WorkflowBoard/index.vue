<template>
  <div class="board d-flex flex-column grey lighten-4">
    <div class="filters d-flex align-center px-4">
      <v-text-field
        class="search-field"
        prepend-inner-icon="mdi-magnify"
        placeholder="Search" />
      <div class="ml-5 mr-3">
        <v-avatar
          v-for="{id, imgUrl} in assignees"
          :key="`assignee-${id}`"
          :size="34"
          color="avatar grey lighten2 white--text">
          <img :src="imgUrl">
        </v-avatar>
      </div>
      <v-btn
        @click="filterRecentlyUpdated"
        :elevation="0"
        class="mx-3 filters__btn text-capitalize">
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
import get from 'lodash/get';
import groupBy from 'lodash/groupBy';
import selectTask from '../common/selectTask';
import Sidebar from './Sidebar';

export default {
  name: 'workflow-board',
  mixins: [selectTask],
  computed: {
    ...mapGetters('repository', ['repository', 'workflow', 'tasks']),
    groupedTasks() {
      return groupBy(this.tasks, 'status');
    },
    assignees() {
      return this.tasks.map(it => it.assignee);
    }
  },
  methods: {
    ...mapActions('repository/tasks', ['fetch']),
    getTasksByStatus(statusId) {
      return get(this.groupedTasks, statusId, []);
    },
    filterRecentlyUpdated() {
      // TODO
    }
  },
  created() {
    this.fetch();
  },
  components: { Card, Sidebar }
};
</script>

<style lang="scss" scoped>
%board-layout {
  display: grid;
  max-width: calc(100% - 435px);
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
  border-color: var(--v-white) !important;
}

.filters__btn {
  letter-spacing: inherit;
}
</style>
