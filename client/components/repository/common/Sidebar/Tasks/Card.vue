<template>
  <router-link :to="route">
    <v-sheet elevation="2" class="card px-3 pt-1 pb-4">
      <h4 class="mb-4">{{ name }}</h4>
      <div class="d-flex align-center mt-auto">
        <v-tooltip open-delay="500" bottom>
          <template #activator="{ on }">
            <v-avatar
              v-on="on"
              :size="32"
              color="grey lighten-3">
              <img v-if="assignee" :src="assignee.imgUrl">
              <v-icon v-else>mdi-account</v-icon>
            </v-avatar>
          </template>
          <span v-if="assignee">{{ assignee.fullName || assignee.email }}</span>
          <span v-else>Unassigned</span>
        </v-tooltip>
        <v-tooltip open-delay="500" bottom>
          <template #activator="{ on }">
            <v-icon v-on="on" class="priority-icon mx-5">
              {{ `$vuetify.icons.${priorityConfig.icon}` }}
            </v-icon>
          </template>
          {{ priorityConfig.label }} priority
        </v-tooltip>
        <v-tooltip v-if="dueDate" open-delay="500" bottom>
          <template #activator="{ on }">
            <label-chip v-on="on" class="mr-3">
              {{ dueDate | formatDate('MM/DD/YY') }}
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
          Task ID
        </v-tooltip>
      </div>
    </v-sheet>
  </router-link>
</template>

<script>
import find from 'lodash/find';
import LabelChip from '@/components/repository/common/LabelChip';
import { mapGetters } from 'vuex';
import { priorities } from 'shared/workflow';

export default {
  name: 'activity-sidebar-task-card',
  props: {
    id: { type: Number, default: null },
    name: { type: String, required: true },
    assignee: { type: Object, default: null },
    priority: { type: String, required: true },
    dueDate: { type: String, default: null },
    shortId: { type: String, required: true },
    status: { type: String, required: true }
  },
  computed: {
    ...mapGetters('repository', ['workflow']),
    statusConfig: vm => find(vm.workflow.statuses, { id: vm.status }),
    priorityConfig: vm => priorities.find(it => it.id === vm.priority),
    route: vm => ({ name: 'board', query: { ...vm.$route.query, taskId: vm.id } })
  },
  components: { LabelChip }
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
