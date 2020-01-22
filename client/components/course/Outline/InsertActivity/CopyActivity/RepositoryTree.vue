<template>
  <div v-if="!activities.length" class="ma-3 mt-5">
    Selected {{ schemaName }} is empty.
  </div>
  <v-treeview
    v-else
    ref="treeview"
    :items="activities"
    :search="search"
    transition
    open-all
    dense
    class="mx-3 px-1 py-3 treeview">
    <template v-slot:prepend="{ item }">
      <v-icon
        v-if="item.selectable"
        @click="$emit('toggleSelect', item)"
        :disabled="!isSupported(item)">
        {{ getCheckIcon(item.id) }}
      </v-icon>
    </template>
  </v-treeview>
</template>

<script>
export default {
  props: {
    activities: { type: Array, required: true },
    selected: { type: Array, default: () => ([]) },
    search: { type: String, default: '' },
    schemaName: { type: String, required: true }
  },
  methods: {
    getCheckIcon(id) {
      const isChecked = this.selected.find(it => it.id === id);
      return isChecked ? 'mdi-check-box-outline' : 'mdi-checkbox-blank-outline';
    },
    isSupported(item) {
      return !this.selected.length || (this.selected[0].level === item.level);
    }
  },
  watch: {
    activities(val) {
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
