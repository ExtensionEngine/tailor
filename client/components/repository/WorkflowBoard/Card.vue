<template>
  <v-card
    @click="$emit('click', task.id)"
    :elevation="isSelected ? 0 : 1"
    class="card d-flex flex-column align-start pa-3"
    :class="{ 'bordered': isSelected }"
    :ripple="false">
    <div class="card-title mt-3 mb-5 text-left font-weight-regular">
      {{ task.name }}
    </div>
    <div class="d-flex align-center mt-auto">
      <v-tooltip open-delay="500" bottom>
        <template #activator="{ on }">
          <v-avatar
            v-on="on"
            :size="24"
            color="grey lighten-3"
            class="avatar mr-3 d-flex white--text">
            <img v-if="task.assignee" :src="task.assignee.imgUrl">
            <v-icon v-else :size="16">mdi-account</v-icon>
          </v-avatar>
        </template>
        <span v-if="task.assignee">{{ task.assignee.fullName || task.assignee.email }}</span>
        <span v-else>Unassigned</span>
      </v-tooltip>
      <v-tooltip open-delay="500" bottom>
        <template #activator="{ on }">
          <v-icon
            v-on="on"
            class="priority-icon mr-3">
            {{ `$vuetify.icons.${priority.icon}` }}
          </v-icon>
        </template>
        {{ priority.label }} priority
      </v-tooltip>
      <v-tooltip open-delay="500" bottom>
        <template #activator="{ on }">
          <label-chip
            v-if="task.dueDate"
            v-on="on"
            class="mr-3">
            {{ task.dueDate | formatDate('MM/DD/YY') }}
          </label-chip>
        </template>
        Due date
      </v-tooltip>
      <v-tooltip open-delay="500" bottom>
        <template #activator="{ on }">
          <label-chip v-on="on">{{ task.shortId }}</label-chip>
        </template>
        Task ID
      </v-tooltip>
    </div>
  </v-card>
</template>

<script>
import LabelChip from '@/components/repository/common/LabelChip';
import { priorities } from 'shared/workflow';

export default {
  name: 'workflow-board-card',
  props: {
    task: { type: Object, default: () => ({}) },
    isSelected: { type: Boolean, default: false }
  },
  computed: {
    priority() {
      const { priority } = this.task;
      const { icon, label } = priorities.find(it => it.id === priority);
      return { icon, label };
    }
  },
  components: { LabelChip }
};
</script>

<style lang="scss" scoped>
  .card.v-card {
    min-height: 10rem;
    align-self: stretch;

    .card-title {
      font-size: 1rem;
      line-height: 1.2;
    }

    &.bordered {
      border: 2px solid var(--v-primary-base);
    }

    .avatar.v-avatar {
      border-radius: 50%;
    }

    .priority-icon {
      width: 0.75rem;
    }

    &::before {
      opacity: 0;
    }
  }
</style>
