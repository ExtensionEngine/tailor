<template>
  <section class="mt-9 mb-4">
    <v-text-field v-model="task.status" label="Status" outlined />
    <v-select
      :value="task.assignee.id"
      :items="assigneeOptions"
      label="Assignee"
      item-text="label"
      item-value="value"
      outlined />
    <v-select
      :value="task.priority"
      :items="priorities"
      label="Priority"
      item-text="label"
      item-value="value"
      outlined />
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
        @input="$emit('change', $event);"
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

export default {
  name: 'workflow-board-task-form',
  props: {
    task: { type: Object, default: () => ({}) }
  },
  data: () => ({ showDialog: false }),
  computed: {
    ...mapGetters('repository', ['users']),
    assigneeOptions() {
      return this.users.map(it => ({ value: it.id, label: it.fullName }));
    },
    priorities() {
      return priorities.map(it => ({ value: it.id, label: it.label }));
    }
  },
  methods: {
    ...mapActions('repository', ['getUsers'])
  },
  created() {
    this.getUsers();
  }
};
</script>
