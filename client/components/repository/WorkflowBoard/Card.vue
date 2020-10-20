<template>
  <v-sheet
    @click="$emit('click', id)"
    :elevation="isSelected ? 0 : 1"
    :class="{ bordered: isSelected }"
    class="card d-flex flex-column align-start pa-3">
    <v-card-title class="card-title pa-0 mt-3 mb-5 text-left font-weight-regular">
      {{ name }}
    </v-card-title>
    <div class="d-flex align-center mt-auto">
      <assignee-avatar v-bind="assignee" small class="mr-3" />
      <v-tooltip open-delay="500" bottom>
        <template #activator="{ on }">
          <v-icon
            v-on="on"
            class="priority-icon mr-3">
            {{ `$vuetify.icons.${priorityConfig.icon}` }}
          </v-icon>
        </template>
        {{ priorityConfig.label }} priority
      </v-tooltip>
      <v-tooltip v-if="dueDate" open-delay="500" bottom>
        <template #activator="{ on }">
          <label-chip
            v-on="on"
            class="mr-3">
            {{ dueDate | formatDate('MM/DD/YY') }}
          </label-chip>
        </template>
        Due date
      </v-tooltip>
      <v-tooltip open-delay="500" bottom>
        <template #activator="{ on }">
          <label-chip v-on="on">{{ shortId }}</label-chip>
        </template>
        Task ID
      </v-tooltip>
    </div>
  </v-sheet>
</template>

<script>
import AssigneeAvatar from '@/components/repository/common/AssigneeAvatar';
import LabelChip from '@/components/repository/common/LabelChip';
import { priorities } from 'shared/workflow';

export default {
  name: 'workflow-board-card',
  props: {
    id: { type: Number, required: true },
    shortId: { type: String, required: true },
    name: { type: String, required: true },
    priority: { type: String, required: true },
    status: { type: String, required: true },
    dueDate: { type: String, default: null },
    assignee: { type: Object, default: null },
    avatarUrl: { type: String, default: null },
    isSelected: { type: Boolean, default: false }
  },
  computed: {
    priorityConfig: vm => priorities.find(it => it.id === vm.priority)
  },
  components: { LabelChip, AssigneeAvatar }
};
</script>

<style lang="scss" scoped>
.card {
  min-height: 10rem;
  border-radius: 4px;

  &:hover {
    cursor: pointer;
  }

  .card-title {
    font-size: 1rem;
    line-height: 1.2;
  }

  &.bordered {
    border: 2px solid var(--v-primary-base);
  }

  .priority-icon {
    width: 0.75rem;
  }

  &::before {
    opacity: 0;
  }
}
</style>
