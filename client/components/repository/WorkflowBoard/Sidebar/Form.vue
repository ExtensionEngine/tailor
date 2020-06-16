<template>
  <section class="mt-9 mb-4">
    <v-text-field
      @change="updateTask('name', $event)"
      :value="task.name"
      label="Name"
      outlined />
    <v-text-field
      @change="updateTask('description', $event)"
      :value="task.description"
      label="Description"
      outlined />
    <v-select
      @change="updateTask('status', $event)"
      :value="task.status"
      :items="workflow.statuses"
      label="Status"
      item-value="id"
      item-text="label"
      outlined />
    <v-select
      @change="updateTask('assigneeId', $event)"
      :value="task.assigneeId"
      :items="users"
      label="Assignee"
      item-text="fullName"
      item-value="id"
      outlined
      clearable />
    <select-priority
      @change="updateTask('priority', $event)"
      :value="task.priority"
      :items="priorities" />
    <date-picker
      @input="updateTask('dueDate', $event)"
      :value="task.dueDate"
      label="Due date" />
  </section>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import DatePicker from '@/components/common/DatePicker';
import { priorities } from 'shared/workflow';
import SelectPriority from '@/components/repository/common/SelectPriority';

export default {
  name: 'workflow-board-task-form',
  props: {
    task: { type: Object, default: () => ({}) }
  },
  data: () => ({ showDatePicker: false, priorities }),
  computed: mapGetters('repository', ['users', 'workflow']),
  methods: {
    ...mapActions('repository', ['getUsers']),
    ...mapActions('repository/tasks', ['update']),
    async updateTask(key, value) {
      await this.update({ ...this.task, [key]: value || null });
      this.$snackbar.show(`${this.task.name} saved`);
    }
  },
  components: { DatePicker, SelectPriority }
};
</script>
