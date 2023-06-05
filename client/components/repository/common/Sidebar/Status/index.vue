<template>
  <v-hover v-slot="{ hover }">
    <v-card
      :to="route"
      :color="hover ? 'primary lighten-4' : 'primary lighten-5'"
      flat
      class="pa-2">
      <div class="d-flex align-center mt-auto">
        <v-tooltip open-delay="500" bottom>
          <template #activator="{ on }">
            <span
              v-on="on"
              class="d-flex align-center mr-2 text-body-2 text-uppercase font-weight-bold">
              <v-icon :color="statusConfig.color" small class="mr-1">mdi-circle</v-icon>
              <span>{{ statusConfig.label }}</span>
            </span>
          </template>
          Status
        </v-tooltip>
        <assignee-avatar
          v-bind="status.assignee"
          show-tooltip small
          class="mx-3" />
        <v-tooltip open-delay="500" bottom>
          <template #activator="{ on }">
            <v-icon v-on="on" class="priority-icon mx-3">
              {{ `$vuetify.icons.${priorityConfig.icon}` }}
            </v-icon>
          </template>
          {{ priorityConfig.label }} priority
        </v-tooltip>
        <v-tooltip v-if="status.dueDate" open-delay="500" bottom>
          <template #activator="{ on }">
            <workflow-due-date
              v-on="on"
              :value="status.dueDate"
              format="MM/DD/YY"
              class="mx-2 text-caption" />
          </template>
          Due date
        </v-tooltip>
        <v-spacer />
        <v-icon dense>mdi-arrow-right</v-icon>
      </div>
    </v-card>
  </v-hover>
</template>

<script>
import AssigneeAvatar from '@/components/repository/common/AssigneeAvatar';
import find from 'lodash/find';
import { mapGetters } from 'vuex';
import { workflow } from 'tailor-config';
import WorkflowDueDate from '@/components/repository/common/WorkflowDueDate';

export default {
  name: 'activity-status-card',
  inject: ['$schemaService'],
  props: {
    id: { type: Number, default: null },
    shortId: { type: String, required: true },
    type: { type: String, required: true },
    status: { type: Object, required: true }
  },
  computed: {
    ...mapGetters('repository', ['workflow']),
    activityConfig: vm => vm.$schemaService.getLevel(vm.type),
    statusConfig: vm => find(vm.workflow.statuses, { id: vm.status.status }),
    priorityConfig: vm => workflow.getPriority(vm.status.priority),
    route: vm => ({ name: 'progress', query: vm.$route.query })
  },
  components: { WorkflowDueDate, AssigneeAvatar }
};
</script>

<style lang="scss" scoped>
.priority-icon {
  width: 0.875rem;
}
</style>
