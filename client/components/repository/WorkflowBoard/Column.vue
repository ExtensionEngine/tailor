<template>
  <draggable
    :key="status.id"
    @change="setTaskStatus($event, status.id)"
    :list="tasksByStatus"
    group="tasks"
    class="d-flex flex-column align-center grey lighten-3">
    <task-card
      v-for="task in tasksByStatus"
      :key="task.id"
      @click="selectTask"
      :is-selected="selectedTask && selectedTask.id === task.id"
      :task="task"
      class="my-2 mx-3" />
  </draggable>
</template>

<script>
import Draggable from 'vuedraggable';
import get from 'lodash/get';
import { mapActions } from 'vuex';
import selectTask from '../common/selectTask';
import TaskCard from './Card';

export default {
  name: 'workflow-board-column',
  mixins: [selectTask],
  props: {
    status: { type: Object, default: () => ({}) },
    tasks: { type: Object, default: () => ({}) }
  },
  computed: {
    tasksByStatus() {
      return get(this.tasks, this.status.id, []);
    }
  },
  methods: {
    ...mapActions('repository/tasks', ['save']),
    setTaskStatus(update, status) {
      if (!update.added) return;
      const { element: task } = update.added;
      return this.save({ ...task, status });
    }
  },
  components: { Draggable, TaskCard }
};
</script>
