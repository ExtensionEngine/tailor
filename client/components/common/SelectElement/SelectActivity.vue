<template>
  <div class="mx-3">
    <v-text-field
      v-model="search"
      placeholder="Filter items..."
      prepend-inner-icon="mdi-filter-outline"
      clear-icon="mdi-close-circle-outline"
      clearable outlined />
    <v-treeview
      v-show="hasSearchResults"
      ref="treeview"
      :items="activityTree"
      :search="search"
      activatable transition open-all
      class="py-3 px-1 treeview">
      <template v-slot:label="{ item: { id, data } }">
        {{ data.name }}
        <v-chip
          v-if="groupedSelection[id]"
          rounded small
          class="custom-chip">
          {{ getChipLabel(groupedSelection[id]) }}
        </v-chip>
      </template>
      <template v-slot:append="{ item }">
        <v-btn
          v-if="hasContentContainers(item.type)"
          @click="$emit('selected', item)"
          color="primary"
          outlined small>
          View elements
        </v-btn>
      </template>
    </v-treeview>
    <v-alert :value="!hasSearchResults" color="primary" dark>
      No matches found.
    </v-alert>
  </div>
</template>

<script>
import groupBy from 'lodash/groupBy';
import { isEditable } from 'shared/activities';
import { mapGetters } from 'vuex';
import pluralize from 'pluralize';
import { toTreeFormat } from 'utils/activity';

export default {
  name: 'select-activity',
  props: {
    selectedElements: { type: Array, default: () => [] }
  },
  data: () => ({ search: '' }),
  computed: {
    ...mapGetters('repository', ['activities']),
    groupedSelection: vm => groupBy(vm.selectedElements, 'outlineId'),
    activityTree: vm => toTreeFormat(vm.activities, []),
    hasSearchResults() {
      if (!this.search || !this.$refs) return true;
      const { excludedItems, nodes } = this.$refs.treeview;
      return excludedItems.size !== Object.keys(nodes).length;
    }
  },
  methods: {
    hasContentContainers: isEditable,
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
}
</style>
