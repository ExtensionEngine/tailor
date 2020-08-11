<template>
  <div>
    <div class="d-flex justify-space-between align-center">
      <h5>Related Task</h5>
      <create-task-dialog v-if="!activityTasks.length" :activity="activity" heading="Add task" />
    </div>
    <div class="d-flex flex-column">
      <task-card
        v-for="task in activityTasks"
        :key="task.id"
        :to="getTaskRoute(task.id)"
        v-bind="task"
        :status="getStatusLabel(task.status)"
        :avatar-url="task.assignee && task.assignee.imgUrl"
        class="px-3 pt-1 pb-4" />
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import CreateTaskDialog from '../CreateTaskDialog';
import find from 'lodash/find';
import { priorities } from 'shared/workflow';
import TaskCard from './Card';

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
  components: { CreateTaskDialog, TaskCard }
};
</script>
