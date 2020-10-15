<template>
  <v-navigation-drawer
    width="450"
    color="grey lighten-5"
    absolute right permanent>
    <article
      v-if="selectedTask"
      :key="selectedTask.uid"
      class="px-4 pt-4 pb-10">
      <sidebar-header v-bind="selectedTask" />
      <task-field-group @update="updateTask" v-bind="selectedTask" class="mt-9 mb-4" />
      <section>
        <h5>Related content</h5>
        <activity-card v-bind="activity" :name="activity.data.name" />
      </section>
    </article>
    <article v-else class="placeholder grey--text text--darken-3">
      <h4>Task Sidebar</h4>
      <v-icon>mdi-chevron-left</v-icon>
      <div class="info-content">{{ emptyMessage }}</div>
    </article>
  </v-navigation-drawer>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import ActivityCard from './ActivityCard';
import SidebarHeader from './Header';
import TaskFieldGroup from './FieldGroup';

export default {
  props: {
    emptyMessage: {
      type: String,
      default: 'Please select Task on the left to view and edit its details here.'
    }
  },
  computed: {
    ...mapGetters('repository', ['selectedTask', 'activities']),
    activity: vm => vm.activities.find(({ id }) => vm.selectedTask.activityId === id)
  },
  methods: {
    ...mapActions('repository/tasks', ['save']),
    updateTask(descriptor, value) {
      this.save({ ...this.selectedTask, [descriptor]: value || null })
        .then(() => { this.$snackbar.show(`${this.selectedTask.name} saved`); });
    }
  },
  components: { ActivityCard, TaskFieldGroup, SidebarHeader }
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
