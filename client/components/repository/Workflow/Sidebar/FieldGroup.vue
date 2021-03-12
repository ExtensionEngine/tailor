<template>
  <section>
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
      <select-status
        @change="update('status', $event)"
        :value="status"
        :items="workflow.statuses"
        :error-messages="errors"
        label="Status"
        outlined
        class="my-2" />
    </validation-provider>
    <v-select
      @change="update('assigneeId', $event)"
      :value="assigneeId"
      :items="users"
      item-text="label"
      label="Assignee"
      placeholder="Click to set assignee"
      item-value="id"
      outlined clearable
      class="my-2">
      <template #selection="{ item }">
        <div class="selection d-flex align-center flex-nowrap">
          <v-avatar size="26" class="mr-2">
            <img :src="item.imgUrl">
          </v-avatar>
          <span class="text--default text-truncate">{{ item.label }}</span>
        </div>
      </template>
      <template #item="{ item }">
        <v-avatar size="26" class="mr-2">
          <img :src="item.imgUrl">
        </v-avatar>
        <span class="text--default">{{ item.label }}</span>
      </template>
    </v-select>
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
import SelectPriority from '@/components/repository/common/SelectPriority';
import SelectStatus from '../SelectStatus';
import { workflow } from '@tailor/config';

const defaultPriority = workflow.priorities.find(it => it.default);

export default {
  name: 'status-field-group',
  props: {
    description: { type: String, default: null },
    status: { type: String, default: null },
    assigneeId: { type: Number, default: null },
    priority: {
      type: String,
      default: defaultPriority.id
    },
    dueDate: { type: String, default: null }
  },
  data: () => ({ showDatePicker: false }),
  computed: {
    ...mapGetters('repository', ['users', 'workflow']),
    priorities: () => workflow.priorities
  },
  methods: {
    ...mapActions('repository', ['getUsers']),
    async validateField(key, value) {
      const field = this.$refs[key];
      if (!field) return true;
      const validationResult = await field.validate(value);
      await field.applyResult(validationResult);
      return validationResult.valid;
    },
    async update(key, value) {
      if (this[key] === value) return;
      const isValid = await this.validateField(key, value);
      if (!isValid) return;
      this.$emit('update', key, value);
      this.$emit(`update:${key}`, value);
    }
  },
  components: {
    DatePicker,
    EditorField,
    SelectPriority,
    SelectStatus
  }
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
