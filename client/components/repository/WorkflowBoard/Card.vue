<template>
  <v-card
    @click="$emit('click', id)"
    :elevation="isSelected ? 0 : 1"
    :ripple="false"
    :class="{ bordered: isSelected }"
    class="card d-flex flex-column align-start pa-3">
    <div class="card-title mt-3 mb-5 text-left font-weight-regular">
      {{ name }}
    </div>
    <div class="d-flex align-center mt-auto">
      <v-tooltip open-delay="500" bottom>
        <template #activator="{ on }">
          <v-avatar
            v-on="on"
            :size="24"
            color="grey lighten-3"
            class="avatar mr-3 d-flex white--text">
            <img v-if="assignee" :src="assignee.imgUrl">
            <v-icon v-else :size="16">mdi-account</v-icon>
          </v-avatar>
        </template>
        <span v-if="assignee">{{ assignee.fullName || assignee.email }}</span>
        <span v-else>Unassigned</span>
      </v-tooltip>
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
  </v-card>
</template>

<script>
import LabelChip from '@/components/repository/common/LabelChip';
import { priorities } from 'shared/workflow';

export default {
  name: 'workflow-board-card',
  props: {
    id: { type: Number, required: true },
    name: { type: String, required: true },
    assignee: { type: Object, default: null },
    avatarUrl: { type: String, default: null },
    priority: { type: String, required: true },
    dueDate: { type: String, default: null },
    shortId: { type: String, required: true },
    status: { type: String, required: true },
    isSelected: { type: Boolean, default: false }
  },
  computed: {
    priorityConfig: vm => priorities.find(it => it.id === vm.priority)
  },
  components: { LabelChip }
};
</script>

<style lang="scss" scoped>
  .card.v-card {
    min-height: 10rem;

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
