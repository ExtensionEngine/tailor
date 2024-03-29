<template>
  <v-alert
    v-if="!activities.length"
    color="primary darken-2"
    dark
    class="mx-3">
    Selected {{ schemaName }} is empty.
  </v-alert>
  <div v-else class="mx-3">
    <v-text-field
      v-model="search"
      :placeholder="`Filter selected ${schemaName}...`"
      prepend-inner-icon="mdi-filter-outline"
      clear-icon="mdi-close-circle-outline"
      clearable outlined />
    <v-treeview
      v-show="hasSearchResults"
      ref="treeview"
      :items="activityTree"
      :search="search"
      transition open-all dense
      class="px-1 py-3 treeview">
      <template #prepend="{ item }">
        <v-icon
          v-if="item.selectable"
          @click="toggleSelection(item)"
          :disabled="!isSelectable(item)">
          mdi-check{{ isSelected(item) ? '-box-outline' : 'box-blank-outline' }}
        </v-icon>
      </template>
    </v-treeview>
    <v-alert :value="!hasSearchResults" color="primary darken-2" dark>
      No matches found.
    </v-alert>
  </div>
</template>

<script>
import { activity as activityUtils } from '@tailor-cms/utils';
import xorBy from 'lodash/xorBy';

const { toTreeFormat } = activityUtils;

export default {
  inject: ['$schemaService'],
  props: {
    schemaName: { type: String, required: true },
    activities: { type: Array, required: true },
    supportedLevels: { type: Array, required: true }
  },
  data: () => ({ selected: [], search: '' }),
  computed: {
    attachActivityAttrs() {
      return activity => ({
        selectable: this.supportedLevels.some(it => it.type === activity.type)
      });
    },
    activityTree() {
      return toTreeFormat(this.activities, {
        filterNodesFn: this.$schemaService.filterOutlineActivities,
        processNodeFn: this.attachActivityAttrs
      });
    },
    hasSearchResults() {
      if (!this.search || !this.$refs) return true;
      const { excludedItems, nodes } = this.$refs.treeview;
      return excludedItems.size !== Object.keys(nodes).length;
    }
  },
  methods: {
    toggleSelection(item) {
      this.selected = xorBy(this.selected, [item], 'id');
      this.$emit('change', this.selected);
    },
    isSelected(item) {
      return this.selected.find(it => it.id === item.id);
    },
    isSelectable(item) {
      return !this.selected.length || (this.selected[0].level === item.level);
    }
  },
  watch: {
    activities(val) {
      this.selected = [];
      this.search = '';
      if (val.length) this.$nextTick(() => this.$refs.treeview.updateAll(true));
    }
  }
};
</script>

<style lang="scss" scoped>
.treeview {
  border: 1px solid #eee;
  max-height: 19rem;
  background-color: #fcfcfc;
  text-align: left;
  overflow-y: scroll;
}
</style>
