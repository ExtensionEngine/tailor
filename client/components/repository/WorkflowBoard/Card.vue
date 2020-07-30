<template>
  <v-card
    @click="$emit('click', task.id)"
    :elevation="isSelected ? 0 : 1"
    class="card d-flex flex-column align-start px-4 py-3 my-2 mx-3"
    :class="{ 'bordered': isSelected }"
    :ripple="false">
    <label-chip>{{ task.shortId }}</label-chip>
    <h4 class="text-left card-title">
      {{ task.name }}
    </h4>
    <div class="d-flex align-center mt-auto">
      <v-avatar :size="32" color="avatar grey lighten-3 d-flex white--text">
        <img v-if="task.assignee" :src="task.assignee.imgUrl">
        <v-icon v-else>mdi-account</v-icon>
      </v-avatar>
      <v-icon class="priority-icon mx-5">$vuetify.icons.{{ icon }}</v-icon>
      <label-chip v-if="task.dueDate">{{ task.dueDate | formatDate('MM/DD/YY') }}</label-chip>
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
    icon() {
      const { priority } = this.task;
      const { icon } = priorities.find(it => it.id === priority);
      return icon;
    }
  },
  components: { LabelChip }
};
</script>

<style lang="scss" scoped>
  .card.v-card {
    min-height: 10rem;
    align-self: stretch;

    &.bordered {
      border: 2px solid var(--v-primary-base);
    }

    .avatar.v-avatar {
      border-radius: 50%;
    }

    .priority-icon {
      width: 0.8rem;
    }

    &::before {
      opacity: 0;
    }
  }
</style>
