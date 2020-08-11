<template>
  <v-navigation-drawer
    width="450"
    color="grey lighten-5"
    absolute right permanent>
    <article
      v-if="selectedTask"
      :key="selectedTask._cid"
      class="px-4 pt-4 pb-10">
      <sidebar-header v-bind="selectedTask" :cid="selectedTask._cid" />
      <task-form :task="selectedTask" />
      <section>
        <h5>Related content</h5>
        <activity-card v-bind="activity" :name="activity.data.name" />
      </section>
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
import ActivityCard from './ActivityCard';
import { mapGetters } from 'vuex';
import SidebarHeader from './Header';
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
    activity() {
      return this.activities.find(it => it.id === this.selectedTask.activityId);
    }
  },
  components: {
    ActivityCard,
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
