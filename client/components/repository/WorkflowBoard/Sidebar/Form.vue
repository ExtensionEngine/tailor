<template>
  <section class="mt-9 mb-4">
    <validation-provider
      v-slot="{ errors }"
      ref="name"
      :rules="{ required: true }"
      name="name">
      <v-text-field
        @change="updateTask('name', $event)"
        :value="task.name"
        :error-messages="errors"
        label="Name"
        class="my-2"
        outlined />
    </validation-provider>
    <editor-field
      @change="updateTask('description', $event)"
      :value="task.description"
      label="Description"
      class="editor-field mt-2" />
    <v-select
      @change="updateTask('status', $event)"
      :value="task.status"
      :items="workflow.statuses"
      label="Status"
      item-value="id"
      item-text="label"
      class="my-2"
      outlined />
    <v-select
      @change="updateTask('assigneeId', $event)"
      :value="task.assigneeId"
      :items="users"
      :item-text="getUserLabel"
      label="Assignee"
      placeholder="Click to set assignee"
      item-value="id"
      class="my-2"
      outlined
      clearable />
    <select-priority
      @change="updateTask('priority', $event)"
      :value="task.priority"
      :items="priorities"
      class="my-2" />
    <date-picker
      @input="updateTask('dueDate', $event)"
      :value="task.dueDate"
      label="Due date"
      placeholder="Click to set due date"
      class="my-2" />
  </section>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import DatePicker from '@/components/common/DatePicker';
import EditorField from '@/components/common/EditorField';
import { priorities } from 'shared/workflow';
import SelectPriority from '@/components/repository/common/SelectPriority';

export default {
  name: 'workflow-board-task-form',
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
    async validateField(descriptor, value) {
      const field = this.$refs[descriptor];
      if (!field) return true;
      const validationResult = await field.validate(value);
      await field.applyResult(validationResult);
      return validationResult.valid;
    },
    async updateTask(descriptor, value) {
      if (this.task[descriptor] === value) return;
      const isValid = await this.validateField(descriptor, value);
      if (!isValid) return;
      await this.save({ ...this.task, [descriptor]: value || null });
      this.$snackbar.show(`${this.task.name} saved`);
    }
  },
  components: { DatePicker, EditorField, SelectPriority }
};
</script>

<style lang="scss" scoped>
.editor-field {
  margin-bottom: 2.375rem;

  ::v-deep .v-label {
    background: #fafafa;
  }
}
</style>
