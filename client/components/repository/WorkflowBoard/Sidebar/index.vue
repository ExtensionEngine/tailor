<template>
  <v-navigation-drawer
    width="450"
    color="grey lighten-5"
    absolute right permanent>
    <article
      v-if="selectedTask"
      :key="selectedTask._cid"
      class="px-4 pt-4 pb-10">
      <sidebar-header :task="selectedTask" />
      <task-form :task="selectedTask" />
      <task-activities :activities="taskActivities" />
    </article>
    <article v-else class="placeholder grey--text text--darken-3">
      <h4>Task Sidebar</h4>
      <v-icon>mdi-chevron-left</v-icon>
      <div class="info-content">
        {{ emptyMessage }}
      </div>
    </article>
  </v-navigation-drawer>
</template>

<script>
import { mapGetters } from 'vuex';
import SidebarHeader from './Header';
import TaskActivities from './Activities';
import TaskForm from './Form';

export default {
  props: {
    emptyMessage: {
      type: String,
      default: 'Please select Task on the left to view and edit its details here.'
    }
  },
  computed: {
    ...mapGetters('repository', ['selectedTask', 'activities']),
    taskActivities() {
      return this.activities.filter(it => it.taskId === this.selectedTask.id);
    }
  },
  components: {
    TaskActivities,
    TaskForm,
    SidebarHeader
  }
};
</script>

<style lang="scss" scoped>
.v-navigation-drawer {
  text-align: left;
}

.placeholder {
  margin-top: 4.375rem;
  padding: 0 1rem;

  h4 {
    padding: 0.5rem 0 1.125rem;
    text-align: center;
    font-size: 1.25rem;
  }

  .v-icon {
    float: left;
    padding: 0.375rem 1.25rem 0 0.75rem;
    color: inherit;
    font-size: 2rem;
  }

  .info-content {
    width: 22rem;
  }
}
</style>
