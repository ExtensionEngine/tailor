<template>
  <router-link :to="route">
    <v-sheet
      :color="color"
      class="card d-flex justify-space-between align-center pa-2">
      <div class="text-truncate">{{ name }}</div>
      <v-tooltip open-delay="500" bottom>
        <template #activator="{ on }">
          <label-chip v-on="on" class="flex-shrink-0 ml-2">{{ shortId }}</label-chip>
        </template>
        {{ config.label }} ID
      </v-tooltip>
    </v-sheet>
  </router-link>
</template>

<script>
import find from 'lodash/find';
import LabelChip from '@/components/repository/common/LabelChip';
import { mapGetters } from 'vuex';

export default {
  name: 'workflow-board-activity-card',
  props: {
    id: { type: Number, required: true },
    name: { type: String, required: true },
    shortId: { type: String, required: true },
    type: { type: String, required: true }
  },
  computed: {
    ...mapGetters('repository', ['structure', 'isCollapsed']),
    config: vm => find(vm.structure, { type: vm.type }),
    color: vm => vm.config.color,
    route: vm => ({ name: 'repository', query: { activityId: vm.id } })
  },
  components: { LabelChip }
};
</script>

<style lang="scss" scoped>
$background-color: #eceff1;

.card {
  background: $background-color !important;
  border-radius: 4px;
  border-left: 4px solid currentColor;

  &:hover {
    background-color: darken($background-color, 5) !important;
  }

  .label {
    color: inherit;
  }
}
</style>
