<template>
  <div class="mx-3">
    <v-text-field
      v-model="search"
      :disabled="!activities.length"
      placeholder="Filter items..."
      prepend-inner-icon="mdi-filter-outline"
      clear-icon="mdi-close-circle-outline"
      clearable outlined />
    <v-treeview
      v-show="!noResultsMessage"
      ref="treeview"
      :items="activityTree"
      :search="search"
      :open="expandedActivityIds"
      transition open-on-click
      class="py-3 px-1 treeview">
      <template v-slot:label="{ item: { id, data } }">
        {{ data.name }}
        <v-chip
          v-if="groupedSelection[id]"
          rounded small
          class="readonly custom-chip">
          {{ getChipLabel(groupedSelection[id]) }}
        </v-chip>
      </template>
      <template v-slot:append="{ item }">
        <v-btn
          v-if="hasContentContainers(item.type)"
          @click="$emit('selected', item)"
          color="primary darken-2"
          outlined small>
          View elements
        </v-btn>
      </template>
    </v-treeview>
    <v-alert :value="!!noResultsMessage" color="primary darken-2" dark>
      {{ noResultsMessage }}
    </v-alert>
  </div>
</template>

<script>
import { activity as activityUtils } from '@tailor/utils';
import groupBy from 'lodash/groupBy';
import map from 'lodash/map';
import pluralize from 'pluralize';

const { toTreeFormat } = activityUtils;

export default {
  name: 'select-activity',
  inject: ['$schemaService'],
  props: {
    selectedElements: { type: Array, default: () => [] },
    activities: { type: Array, default: () => [] }
  },
  data: () => ({ search: '' }),
  computed: {
    groupedSelection: vm => groupBy(vm.selectedElements, 'outlineId'),
    expandedActivityIds: vm => map(vm.activities, 'id'),
    activityTree: vm => toTreeFormat(vm.activities, vm.$schemaService),
    noResultsMessage() {
      const { activities, search, $refs } = this;
      if (!activities.length) return 'Empty repository';
      if (!search || !$refs) return '';
      const { excludedItems, nodes } = $refs.treeview;
      const hasSearchResults = excludedItems.size !== Object.keys(nodes).length;
      return !hasSearchResults && 'No matches found';
    }
  },
  methods: {
    hasContentContainers(type) {
      return this.$schemaService.isEditable(type);
    },
    getChipLabel({ length }) {
      return `${length} ${pluralize('element', length)} selected`;
    }
  }
};
</script>

<style lang="scss" scoped>
.treeview {
  max-height: 19rem;
  text-align: left;
  background-color: #fcfcfc;
  border: 1px solid #eee;
  overflow-y: scroll;

  .v-chip.custom-chip {
    border-radius: 12px !important;
  }

  ::v-deep .v-treeview-node {
    &--leaf > &__root, &--leaf > &__content > * {
      cursor: auto;
    }
  }
}
</style>
