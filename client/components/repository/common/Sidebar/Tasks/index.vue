<template>
  <div>
    <div class="d-flex justify-space-between align-center">
      <h5>Related Task</h5>
      <create-dialog
        v-if="!activityTasks.length"
        :activity="activity"
        heading="Add task" />
    </div>
    <div class="d-flex flex-column">
      <task-card
        v-for="task in activityTasks"
        :key="task.uid"
        v-bind="task"
        class="px-3 pt-1 pb-4" />
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import CreateDialog from './CreateDialog';
import TaskCard from './Card';

export default {
  name: 'activity-sidebar-tasks',
  props: {
    activity: { type: Object, default: () => ({}) }
  },
  computed: {
    ...mapGetters('repository', ['tasks']),
    activityTasks: vm => vm.tasks.filter(it => it.activityId === vm.activity.id)
  },
  methods: mapActions('repository/tasks', ['fetch']),
  created() {
    this.fetch();
  },
  components: { CreateDialog, TaskCard }
};
</script>
