<template>
  <router-link :to="route">
    <v-sheet elevation="2" class="card px-3 pt-1 pb-4">
      <h4 class="mb-4 h4">{{ name }}</h4>
      <div class="d-flex align-center mt-auto">
        <assignee-avatar v-bind="status.assignee" show-tooltip />
        <v-tooltip open-delay="500" bottom>
          <template #activator="{ on }">
            <v-icon v-on="on" class="priority-icon mx-5">
              {{ `$vuetify.icons.${priorityConfig.icon}` }}
            </v-icon>
          </template>
          {{ priorityConfig.label }} priority
        </v-tooltip>
        <v-tooltip v-if="status.dueDate" open-delay="500" bottom>
          <template #activator="{ on }">
            <label-chip v-on="on" class="mr-3">
              {{ status.dueDate | formatDate('MM/DD/YY') }}
            </label-chip>
          </template>
          Due date
        </v-tooltip>
        <v-tooltip open-delay="500" bottom>
          <template #activator="{ on }">
            <label-chip v-on="on" class="mr-3">
              {{ statusConfig.label }}
            </label-chip>
          </template>
          Status
        </v-tooltip>
        <v-tooltip open-delay="500" bottom>
          <template #activator="{ on }">
            <label-chip v-on="on">{{ shortId }}</label-chip>
          </template>
          Activity ID
        </v-tooltip>
      </div>
    </v-sheet>
  </router-link>
</template>

<script>
import AssigneeAvatar from '@/components/repository/common/AssigneeAvatar';
import find from 'lodash/find';
import LabelChip from '@/components/repository/common/LabelChip';
import { mapGetters } from 'vuex';
import { priorities } from 'shared/workflow';

export default {
  name: 'activity-status-card',
  props: {
    id: { type: Number, default: null },
    shortId: { type: String, required: true },
    name: { type: String, required: true },
    status: { type: Object, required: true }
  },
  computed: {
    ...mapGetters('repository', ['workflow']),
    statusConfig: vm => find(vm.workflow.statuses, { id: vm.status.status }),
    priorityConfig: vm => priorities.find(it => it.id === vm.status.priority),
    route: vm => ({ name: 'progress', query: vm.$route.query })
  },
  components: { LabelChip, AssigneeAvatar }
};
</script>

<style lang="scss" scoped>
.card {
  border-radius: 4px;
}

.priority-icon {
  width: 1rem;
}
</style>
