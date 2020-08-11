<template>
  <v-card
    :to="route"
    class="px-3 pt-1 pb-4">
    <h4 class="mb-4">{{ name }}</h4>
    <div class="d-flex align-center mt-auto">
      <v-avatar
        :size="32"
        color="d-flex grey lighten-3 white--text">
        <img v-if="avatarUrl" :src="avatarUrl">
        <v-icon v-else>mdi-account</v-icon>
      </v-avatar>
      <v-icon class="priority-icon mx-5">
        {{ `$vuetify.icons.${priorityIcon}` }}
      </v-icon>
      <label-chip v-if="dueDate" class="mr-3">
        {{ dueDate | formatDate('MM/DD/YY') }}
      </label-chip>
      <label-chip class="mr-3">
        {{ status }}
      </label-chip>
      <label-chip>{{ shortId }}</label-chip>
    </div>
  </v-card>
</template>

<script>
import LabelChip from '@/components/repository/common/LabelChip';
import { priorities } from 'shared/workflow';

export default {
  name: 'activity-sidebar-task-card',
  props: {
    id: { type: Number, required: true },
    name: { type: String, required: true },
    avatarUrl: { type: String, default: null },
    priority: { type: String, required: true },
    dueDate: { type: String, default: null },
    shortId: { type: String, required: true },
    status: { type: String, required: true }
  },
  computed: {
    priorityIcon: vm => priorities.find(it => it.id === vm.priority).icon,
    route: vm => ({ name: 'board', query: { ...vm.$route.query, taskId: vm.id } })
  },
  components: { LabelChip }
};
</script>

<style lang="scss" scoped>
.priority-icon {
  width: 1rem;
}
</style>
