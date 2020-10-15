<template>
  <validation-observer v-slot="{ handleSubmit }" slim>
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
        <task-field-group v-bind.sync="task" />
      </template>
      <template #actions>
        <v-btn @click="visible = false" text>Cancel</v-btn>
        <v-btn @click="handleSubmit(create)" color="primary" text>Create</v-btn>
      </template>
    </tailor-dialog>
  </validation-observer>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { priorities } from 'shared/workflow';
import TailorDialog from '@/components/common/TailorDialog';
import TaskFieldGroup from '@/components/repository/WorkflowBoard/Sidebar/FieldGroup';

const initTaskState = statuses => ({
  name: null,
  description: null,
  status: statuses ? statuses[0].id : null,
  assigneeId: null,
  priority: priorities[2].id,
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
  computed: mapGetters('repository', ['workflow']),
  methods: {
    ...mapActions('repository/tasks', { createTask: 'create' }),
    close() {
      this.visible = false;
    },
    create() {
      const data = { ...this.task, activityId: this.activity.id };
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
  components: { TaskFieldGroup, TailorDialog }
};
</script>
