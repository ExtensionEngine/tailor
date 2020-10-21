<template>
  <draggable
    :key="status.id"
    @change="updateTask"
    :list="tasksByStatus"
    group="tasks"
    class="d-flex flex-column align-center grey lighten-3">
    <task-card
      v-for="task in tasksByStatus"
      :key="task.id"
      @click="selectTask"
      v-bind="task"
      :assignee="task.assignee"
      :is-selected="selectedTask && selectedTask.id === task.id"
      class="card my-2 mx-3" />
  </draggable>
</template>

<script>
import Draggable from 'vuedraggable';
import get from 'lodash/get';
import { mapActions } from 'vuex';
import selectTask from '@/components/repository/common/selectTask';
import sortBy from 'lodash/sortBy';
import TaskCard from '../Card';

export default {
  name: 'workflow-board-column',
  mixins: [selectTask],
  props: {
    status: { type: Object, default: () => ({}) },
    tasks: { type: Object, default: () => ({}) }
  },
  computed: {
    tasksByStatus: vm => sortBy(get(vm.tasks, vm.status.id, []), ['columnPosition'])
  },
  methods: {
    ...mapActions('repository/tasks', ['save']),
    getNewPosition(index) {
      if (this.tasksByStatus.length === 1) return 1;
      const isFirst = index === 0;
      const isLast = index === this.tasksByStatus.length - 1;
      const prev = this.tasksByStatus[index - 1];
      const next = this.tasksByStatus[index + 1];
      if (isFirst) return next.columnPosition * 0.5;
      if (isLast) return prev.columnPosition + 1;
      return (prev.columnPosition + next.columnPosition) / 2;
    },
    updateTask(update, status) {
      if (!update.added && !update.moved) return;
      const { element: task, newIndex } = update.added || update.moved;
      const columnPosition = this.getNewPosition(newIndex);
      return this.save({ ...task, columnPosition, status: this.status.id });
    }
  },
  components: { Draggable, TaskCard }
};
</script>

<style lang="scss" scoped>
.card {
  align-self: stretch;
}
</style>
