<template>
  <v-card :to="route" :color="color" class="card px-3 pt-1 pb-4">
    <h4 class="mb-4">
      {{ activity.data.name }}
    </h4>
    <chip :id="activity.shortId" />
  </v-card>
</template>

<script>
import Chip from '../Chip';
import find from 'lodash/find';
import { mapGetters } from 'vuex';

export default {
  name: 'workflow-board-sidebar-activity-card',
  props: {
    activity: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    ...mapGetters('repository', ['structure', 'isCollapsed']),
    config: vm => find(vm.structure, { type: vm.activity.type }),
    color: vm => vm.config.color,
    route() {
      const query = { activityId: this.activity.id };
      return { name: 'repository', query };
    }
  },
  components: { Chip }
};
</script>

<style lang="scss" scoped>
.card.v-card {
  background: #fafafa !important;
  border-left: 4px solid currentColor;
}
</style>
