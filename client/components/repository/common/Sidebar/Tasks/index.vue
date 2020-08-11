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
        v-bind="task"
        :assignee="task.assignee"
        class="px-3 pt-1 pb-4" />
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import CreateTaskDialog from '../CreateTaskDialog';
import TaskCard from './Card';

export default {
  name: 'activity-sidebar-tasks',
  props: {
    activity: { type: Object, default: () => ({}) }
  },
  computed: {
    ...mapGetters('repository', ['tasks', 'users']),
    activityTasks: vm => vm.tasks.filter(it => it.activityId === vm.activity.id)
  },
  methods: mapActions('repository/tasks', ['fetch']),
  created() {
    this.fetch();
  },
  components: { CreateTaskDialog, TaskCard }
};
</script>
