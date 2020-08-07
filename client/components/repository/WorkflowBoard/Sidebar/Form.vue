<template>
  <section class="mt-9 mb-4">
    <v-text-field
      v-validate="{ required: true }"
      @change="updateTask('name', $event)"
      :value="task.name"
      :error-messages="vErrors.collect('name')"
      data-vv-name="name"
      label="Name"
      outlined />
    <editor-field
      @change="updateTask('description', $event)"
      label="Description"
      class="editor-field"
      :value="task.description" />
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
      :item-text="getUserLabel"
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
import EditorField from '@/components/common/EditorField';
import { priorities } from 'shared/workflow';
import SelectPriority from '@/components/repository/common/SelectPriority';
import { withValidation } from 'utils/validation';

export default {
  name: 'workflow-board-task-form',
  mixins: [withValidation()],
  props: {
    task: { type: Object, default: () => ({}) }
  },
  data: () => ({ priorities, showDatePicker: false }),
  computed: mapGetters('repository', ['users', 'workflow']),
  methods: {
    ...mapActions('repository', ['getUsers']),
    ...mapActions('repository/tasks', ['save']),
    getUserLabel({ fullName, email }) {
      return fullName || email;
    },
    async updateTask(descriptor, value) {
      if (this.task[descriptor] === value) return;
      const hasValidation = !!this.$validator.fields.items.find(it => it.name === descriptor);
      if (hasValidation) {
        const isValid = await this.$validator.validate(descriptor, value);
        if (!isValid) return;
      }
      await this.save({ ...this.task, [descriptor]: value || null });
      this.$snackbar.show(`${this.task.name} saved`);
    }
  },
  components: { DatePicker, EditorField, SelectPriority }
};
</script>

<style lang="scss" scoped>
.editor-field {
  margin-bottom: 1.875rem;

  ::v-deep .v-label {
    background: #fafafa;
  }
}
</style>
