<template>
  <div>
    <div class="d-flex justify-space-between align-center">
      <h5>Related Task</h5>
      <create-task-dialog v-if="!activityTasks.length" :activity="activity" heading="Add task" />
    </div>
    <div class="d-flex flex-column">
      <v-card
        v-for="task in activityTasks"
        :key="task.id"
        :to="getTaskRoute(task.id)"
        class="px-3 pt-1 pb-4">
        <h4 class="mb-4">{{ task.name }}</h4>
        <div class="d-flex align-center mt-auto">
          <v-avatar
            :size="34"
            color="d-flex grey lighten-3 white--text">
            <img v-if="task.assignee" :src="task.assignee.imgUrl">
            <v-icon v-else>mdi-account</v-icon>
          </v-avatar>
          <v-icon class="priority-icon ml-5 mr-1">
            $vuetify.icons.{{ getPriorityIcon(task.priority) }}
          </v-icon>
          <span class="caption grey--text lighten2">
            {{ task.dueDate | formatDate('MM/DD/YY') }}
          </span>
          <v-chip class="mx-5" label small>{{ task.shortId }}</v-chip>
        </div>
      </v-card>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import CreateTaskDialog from './CreateTaskDialog';
import { priorities } from 'shared/workflow';

export default {
  name: 'activity-sidebar-tasks',
  props: {
    activity: { type: Object, default: () => ({}) }
  },
  computed: {
    ...mapGetters('repository', ['tasks', 'users']),
    activityTasks: vm => vm.tasks.filter(it => it.activityId === vm.activity.id)
  },
  methods: {
    ...mapActions('repository/tasks', ['fetch']),
    getPriorityIcon(priority) {
      const { icon } = priorities.find(it => it.id === priority);
      return icon;
    },
    getTaskRoute(taskId) {
      const query = { taskId };
      return { name: 'board', query };
    }
  },
  created() {
    this.fetch();
  },
  components: { CreateTaskDialog }
};
</script>

<style lang="scss" scoped>
.priority-icon {
  width: 1rem;
}
</style>
