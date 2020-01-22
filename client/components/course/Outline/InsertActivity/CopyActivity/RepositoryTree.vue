<template>
  <v-alert
    v-if="!activities.length"
    color="primary lighten-1"
    icon="mdi-information-outline"
    border="left"
    dark dense
    class="mx-3">
    Selected {{ schemaName }} is empty.
  </v-alert>
  <div v-else>
    <v-text-field
      v-model="search"
      :placeholder="`Filter selected ${schemaName}...`"
      prepend-inner-icon="mdi-filter-outline"
      clear-icon="mdi-close-circle-outline"
      clearable outlined
      class="mx-3" />
    <v-treeview
      ref="treeview"
      :items="activityTree"
      :search="search"
      transition open-all dense
      class="mx-3 px-1 py-3 treeview">
      <template v-slot:prepend="{ item }">
        <v-icon
          v-if="item.selectable"
          @click="toggleSelection(item)"
          :disabled="!isSelectable(item)">
          mdi-check{{ isSelected(item) ? '-box-outline' : 'box-blank-outline' }}
        </v-icon>
      </template>
    </v-treeview>
  </div>
</template>

<script>
import { getOutlineChildren } from 'utils/activity';
import xorBy from 'lodash/xorBy';

function toTreeFormat(activities, targetLevels, parentId = null, level = 1) {
  return getOutlineChildren(activities, parentId).map(activity => ({
    ...activity,
    name: activity.data.name,
    level,
    selectable: targetLevels.find(it => it.type === activity.type),
    children: toTreeFormat(activities, targetLevels, activity.id, level + 1)
  }));
}

export default {
  props: {
    schemaName: { type: String, required: true },
    activities: { type: Array, required: true },
    supportedLevels: { type: Array, required: true }
  },
  data: () => ({ selected: [], search: '' }),
  computed: {
    activityTree: vm => toTreeFormat(vm.activities, vm.supportedLevels)
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
  max-height: 300px;
  text-align: left;
  background-color: #fcfcfc;
  border: 1px solid #eee;
  overflow-y: scroll;
}
</style>
