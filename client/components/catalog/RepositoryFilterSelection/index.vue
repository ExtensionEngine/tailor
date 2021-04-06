<template>
  <v-row class="selected-tags align-center">
    <selected-filter
      v-for="filter in orderedFilters"
      :key="filter.id"
      @close="$emit('close', filter)"
      v-bind="filter"
      :config="configs[filter.type]" />
    <v-btn
      v-show="repositoryFilter.length"
      @click="$emit('clear:all')"
      small rounded
      class="mb-1">
      Clear all
    </v-btn>
  </v-row>
</template>

<script>
import filterConfigs from 'utils/repositoryFilterConfigs';
import { mapState } from 'vuex';
import reduce from 'lodash/reduce';
import SelectedFilter from './SelectedFilter';

export default {
  name: 'repository-filter-selection',
  computed: {
    ...mapState('repositories', ['repositoryFilter']),
    configs: () => filterConfigs,
    orderedFilters: ({ repositoryFilter }) => {
      return reduce(filterConfigs, (orderedFilters, { type }) => {
        const filters = repositoryFilter.filter(it => it.type === type);
        return [...orderedFilters, ...filters];
      }, []);
    }
  },
  components: {
    SelectedFilter
  }
};
</script>

<style lang="scss" scoped>
.selected-tags {
  min-height: 2.5rem;
}
</style>
