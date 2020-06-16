<template>
  <tailor-dialog
    v-model="visible"
    header-icon="mdi-folder-plus-outline">
    <template #activator="{ on }">
      <v-btn v-on="on" text small>+ Create task</v-btn>
    </template>
    <template #header>
      <h4>Add task</h4>
    </template>
    <template #body>
      <form @submit.prevent="create">
        <v-text-field
          v-model="task.name"
          label="Name"
          outlined />
        <v-text-field
          v-model="task.description"
          label="Description"
          outlined />
        <v-select
          v-model="task.status"
          :items="workflow.statuses"
          label="Status"
          item-value="id"
          item-text="label"
          outlined />
        <v-select
          v-model="task.assigneeId"
          :items="users"
          label="Assignee"
          item-text="fullName"
          item-value="id"
          outlined
          clearable />
        <select-priority v-model="task.priority" />
        <date-picker v-model="task.dueDate" label="Due date" />
        <v-btn @click="visible = false" text>Cancel</v-btn>
        <v-btn type="submit" color="primary" text>Create</v-btn>
      </form>
    </template>
  </tailor-dialog>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import DatePicker from '@/components/common/DatePicker';
import { priorities } from 'shared/workflow';
import SelectPriority from '@/components/repository/common/SelectPriority';
import TailorDialog from '@/components/common/TailorDialog';

const initTaskState = statuses => ({
  name: null,
  description: null,
  status: statuses ? statuses[0].id : null,
  assigneeId: null,
  priority: priorities[0].id,
  dueDate: null
});

export default {
  name: 'create-task-dialog',
  props: {
    activity: { type: Object, required: true }
  },
  data: () => ({
    visible: false,
    task: initTaskState()
  }),
  computed: {
    ...mapGetters('repository', ['users', 'workflow'])
  },
  methods: {
    ...mapActions('repository', ['getUsers']),
    ...mapActions('repository/tasks', { createTask: 'create' }),
    close() {
      this.visible = false;
    },
    create() {
      const data = {
        ...this.task,
        activityId: this.activity.id
      };
      this.createTask(data).then(this.close);
    }
  },
  watch: {
    visible(val) {
      if (val) return;
      this.task = initTaskState();
    },
    workflow: {
      handler(val) {
        if (!val) return;
        this.task = initTaskState(val.statuses);
      },
      immediate: true
    }
  },
  created() {
    this.getUsers();
  },
  components: { DatePicker, SelectPriority, TailorDialog }
};
</script>
