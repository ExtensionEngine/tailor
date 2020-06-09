<template>
  <section class="mt-9 mb-4">
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
      outlined />
    <select-priority
      @change="updateTask('priority', $event)"
      :value="task.priority"
      :items="priorities" />
    <v-menu
      v-model="showDialog"
      :close-on-content-click="false"
      min-width="290px"
      transition="scale-transition">
      <template v-slot:activator="{ on }">
        <v-text-field
          v-on="on"
          @click:append="showDialog = true"
          :value="task.dueDate | formatDate('MMM D, YYYY')"
          label="Due date"
          outlined
          readonly />
      </template>
      <v-date-picker
        @input="updateTask('dueDate', $event)"
        @change="showDialog = false"
        :value="task.dueDate | formatDate('YYYY-MM-DD')"
        color="primary"
        no-title />
    </v-menu>
  </section>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { priorities } from 'shared/workflow';
import SelectPriority from './SelectPriority';

export default {
  name: 'workflow-board-task-form',
  props: {
    task: { type: Object, default: () => ({}) }
  },
  data: () => ({ showDialog: false, priorities }),
  computed: mapGetters('repository', ['users', 'workflow']),
  methods: {
    ...mapActions('repository', ['getUsers']),
    ...mapActions('repository/tasks', ['update']),
    async updateTask(key, value) {
      await this.update({ ...this.task, [key]: value });
      this.$snackbar.show(`${this.task.name} saved`);
    }
  },
  created() {
    this.getUsers();
  },
  components: { SelectPriority }
};
</script>
