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
      <v-text-field
        v-model="task.name"
        v-validate="{ required: true }"
        :error-messages="vErrors.collect('name')"
        data-vv-name="name"
        label="Name"
        outlined />
      <editor-field
        @change="task.description = $event"
        :value="task.description"
        label="Description"
        class="editor-field"
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
        :item-text="getUserLabel"
        item-value="id"
        outlined
        clearable />
      <select-priority v-model="task.priority" />
      <date-picker v-model="task.dueDate" label="Due date" />
    </template>
    <template #actions>
      <v-btn @click="visible = false" text>Cancel</v-btn>
      <v-btn @click="create" color="primary" text>Create</v-btn>
    </template>
  </tailor-dialog>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import DatePicker from '@/components/common/DatePicker';
import EditorField from '@/components/common/EditorField';
import { priorities } from 'shared/workflow';
import SelectPriority from '@/components/repository/common/SelectPriority';
import TailorDialog from '@/components/common/TailorDialog';
import { withValidation } from 'utils/validation';

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
  mixins: [withValidation()],
  props: {
    activity: { type: Object, required: true }
  },
  data: () => ({
    visible: false,
    task: initTaskState()
  }),
  computed: mapGetters('repository', ['users', 'workflow']),
  methods: {
    ...mapActions('repository', ['getUsers']),
    ...mapActions('repository/tasks', { createTask: 'create' }),
    getUserLabel({ fullName, email }) {
      return fullName || email;
    },
    close() {
      this.visible = false;
    },
    async create() {
      const isValid = await this.$validator.validateAll();
      if (!isValid) return;
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
  components: { DatePicker, EditorField, SelectPriority, TailorDialog }
};
</script>

<style lang="scss" scoped>
.editor-field {
  margin-bottom: 1.875rem;
}
</style>
