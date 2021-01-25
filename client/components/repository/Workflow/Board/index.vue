<template>
  <div>
    <div class="column-layout px-4">
      <h5
        v-for="status in workflow.statuses"
        :key="status.id"
        class="status-title align-self-start pa-3 grey lighten-3 h5 text-uppercase">
        {{ status.label }}
      </h5>
    </div>
    <div class="column-layout px-4">
      <board-column
        v-for="status in workflow.statuses"
        :key="status.id"
        :tasks="groupedTasksByStatus"
        :status="status"
        class="cards" />
    </div>
  </div>
</template>

<script>
import BoardColumn from './Column';
import groupBy from 'lodash/groupBy';
import { mapGetters } from 'vuex';

export default {
  name: 'workflow-board',
  props: {
    tasks: { type: Array, default: () => ([]) }
  },
  computed: {
    ...mapGetters('repository', ['workflow']),
    groupedTasksByStatus: vm => groupBy(vm.tasks, 'status')
  },
  components: { BoardColumn }
};
</script>

<style lang="scss" scoped>
.column-layout {
  display: grid;
  grid: auto / auto-flow minmax(16rem, 25rem);
  gap: 0 0.75rem;
  width: fit-content;
}

.status-title {
  margin: 0;
}

.cards {
  padding-bottom: 10rem;
}
</style>
