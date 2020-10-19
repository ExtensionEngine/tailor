<template>
  <section>
    <validation-provider
      v-slot="{ errors }"
      ref="name"
      :rules="{ required: true }"
      name="name">
      <v-text-field
        @change="update('name', $event)"
        :value="name"
        :error-messages="errors"
        label="Name"
        class="my-2"
        outlined />
    </validation-provider>
    <editor-field
      @change="update('description', $event)"
      :value="description"
      label="Description"
      class="editor-field mt-2" />
    <validation-provider
      v-slot="{ errors }"
      ref="status"
      :rules="{ required: true }"
      name="status">
      <v-select
        @change="update('status', $event)"
        :value="status"
        :items="workflow.statuses"
        :error-messages="errors"
        label="Status"
        item-value="id"
        item-text="label"
        class="my-2"
        outlined />
    </validation-provider>
    <v-select
      @change="update('assigneeId', $event)"
      :value="assigneeId"
      :items="users"
      item-text="label"
      label="Assignee"
      placeholder="Click to set assignee"
      item-value="id"
      class="my-2"
      outlined clearable />
    <validation-provider
      v-slot="{ errors }"
      ref="priority"
      :rules="{ required: true }"
      name="priority">
      <select-priority
        @change="update('priority', $event)"
        :value="priority"
        :items="priorities"
        :error-messages="errors"
        class="my-2" />
    </validation-provider>
    <date-picker
      @input="update('dueDate', $event)"
      :value="dueDate"
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
  name: 'task-field-group',
  props: {
    name: { type: String, default: '' },
    description: { type: String, default: null },
    status: { type: String, default: null },
    assigneeId: { type: Number, default: null },
    priority: { type: String, default: priorities[2].id },
    dueDate: { type: Date, default: null }
  },
  data: () => ({ showDatePicker: false }),
  computed: {
    ...mapGetters('repository', ['users', 'workflow']),
    priorities: () => priorities
  },
  methods: {
    ...mapActions('repository', ['getUsers']),
    async validateField(descriptor, value) {
      const field = this.$refs[descriptor];
      if (!field) return true;
      const validationResult = await field.validate(value);
      await field.applyResult(validationResult);
      return validationResult.valid;
    },
    async update(descriptor, value) {
      if (this[descriptor] === value) return;
      const isValid = await this.validateField(descriptor, value);
      if (!isValid) return;
      this.$emit('update', descriptor, value);
      this.$emit(`update:${descriptor}`, value);
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
