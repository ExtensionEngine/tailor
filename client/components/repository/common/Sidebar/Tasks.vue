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
            :size="32"
            color="d-flex grey lighten-3 white--text">
            <img v-if="task.assignee" :src="task.assignee.imgUrl">
            <v-icon v-else>mdi-account</v-icon>
          </v-avatar>
          <v-icon class="priority-icon mx-5">
            {{ `$vuetify.icons.${getPriorityIcon(task.priority)}` }}
          </v-icon>
          <label-chip v-if="task.dueDate" class="mr-3">
            {{ task.dueDate | formatDate('MM/DD/YY') }}
          </label-chip>
          <label-chip class="mr-3">
            {{ getStatusLabel(task.status) }}
          </label-chip>
          <label-chip>{{ task.shortId }}</label-chip>
        </div>
      </v-card>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import CreateTaskDialog from './CreateTaskDialog';
import find from 'lodash/find';
import LabelChip from '@/components/repository/common/LabelChip';
import { priorities } from 'shared/workflow';

export default {
  name: 'activity-sidebar-tasks',
  props: {
    activity: { type: Object, default: () => ({}) }
  },
  computed: {
    ...mapGetters('repository', ['tasks', 'users', 'workflow']),
    activityTasks: vm => vm.tasks.filter(it => it.activityId === vm.activity.id)
  },
  methods: {
    ...mapActions('repository/tasks', ['fetch']),
    getStatusLabel(id) {
      const status = find(this.workflow.statuses, { id });
      return status.label;
    },
    getPriorityIcon(priority) {
      const { icon } = priorities.find(it => it.id === priority);
      return icon;
    },
    getTaskRoute(taskId) {
      const query = { ...this.$route.query, taskId };
      return { name: 'board', query };
    }
  },
  created() {
    this.fetch();
  },
  components: { LabelChip, CreateTaskDialog }
};
</script>

<style lang="scss" scoped>
.priority-icon {
  width: 1rem;
}
</style>
