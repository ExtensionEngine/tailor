<template>
  <v-row class="selected-tags align-center">
    <selected-filter
      v-for="filter in orderedFilters"
      :key="filter.id"
      @close="$emit('close', filter)"
      v-bind="filter"
      :icon="configs[filter.type].icon" />
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
import filter from 'lodash/filter';
import filterConfigs from '../repositoryFilterConfigs';
import flatMap from 'lodash/flatMap';
import { mapState } from 'vuex';
import SelectedFilter from './SelectedFilter';

export default {
  name: 'repository-filter-selection',
  computed: {
    ...mapState('repositories', ['repositoryFilter']),
    configs: () => filterConfigs,
    orderedFilters: ({ repositoryFilter }) => {
      return flatMap(filterConfigs, ({ type }) => filter(repositoryFilter, { type }));
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
