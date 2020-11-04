<template>
  <tailor-dialog
    v-model="visible"
    header-icon="mdi-folder-plus-outline">
    <template #activator="{ on }">
      <v-btn v-on="on" text small>
        <v-icon small>mdi-plus</v-icon>
        Create task
      </v-btn>
    </template>
    <template #header>
      <h4 class="h4">Add task</h4>
    </template>
    <template #body>
      <validation-observer
        ref="form"
        @submit.prevent="$refs.form.handleSubmit(create)"
        tag="form">
        <task-field-group v-bind.sync="task" />
        <div class="d-flex justify-end">
          <v-btn @click="visible = false" text>Cancel</v-btn>
          <v-btn type="submit" color="primary" text>Create</v-btn>
        </div>
      </validation-observer>
    </template>
  </tailor-dialog>
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
    ...mapActions('repository/tasks', ['save']),
    close() {
      this.visible = false;
    },
    create() {
      const data = { ...this.task, activityId: this.activity.id };
      this.save(data).then(this.close);
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
