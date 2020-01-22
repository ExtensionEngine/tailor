<template>
  <v-alert
    v-if="!activities.length"
    icon="mdi-information-outline"
    color="primary lighten-1"
    border="left"
    dark dense
    class="mx-3">
    Selected {{ schemaName }} is empty.
  </v-alert>
  <v-treeview
    v-else
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
</template>

<script>
import filter from 'lodash/filter';
import xorBy from 'lodash/xorBy';

function buildActivityTree(activities, types, parentId = null, level = 1) {
  return filter(activities, { parentId }).map(activity => ({
    ...activity,
    name: activity.data.name,
    level,
    selectable: types.find(it => it.type === activity.type),
    children: buildActivityTree(activities, types, activity.id, level + 1)
  }));
}

export default {
  props: {
    schemaName: { type: String, required: true },
    activities: { type: Array, required: true },
    selectableTypes: { type: Array, required: true },
    search: { type: String, default: '' }
  },
  data: () => ({ selected: [] }),
  computed: {
    activityTree: vm => buildActivityTree(vm.activities, vm.selectableTypes)
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
      if (val.length) this.$nextTick(() => this.$refs.treeview.updateAll(true));
    }
  }
};
</script>

<style lang="scss" scoped>
.treeview {
  max-height: 400px;
  background-color: #fcfcfc;
  border: 1px solid #eee;
  text-align: left;
  overflow-y: scroll;
}
</style>
