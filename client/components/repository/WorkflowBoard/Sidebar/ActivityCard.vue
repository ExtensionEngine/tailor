<template>
  <v-card :to="route" :color="color" class="card px-3 pt-1 pb-4">
    <h4 class="mb-4">{{ name }}</h4>
    <label-chip>{{ shortId }}</label-chip>
  </v-card>
</template>

<script>
import find from 'lodash/find';
import LabelChip from '@/components/repository/common/LabelChip';
import { mapGetters } from 'vuex';

export default {
  name: 'workflow-board-sidebar-activity-card',
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
.card.v-card {
  background: #fafafa !important;
  border-left: 4px solid currentColor;
}
</style>
