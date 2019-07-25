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
    class="ma-2 py-3 treeview">
    <template v-slot:prepend="{ item, open }">
      <v-icon>{{ getIcon(item.children, open) }}</v-icon>
    </template>
    <template v-slot:append="{ item }">
      <v-btn
        v-if="item.supported"
        :color="isPicked(item) ? 'primary' : 'primary lighten-2'"
        @click="$emit('toggleSelect', item)"
        flat
        small>
        {{ isPicked(item) ? 'Deselect' : 'Select' }}
      </v-btn>
    </template>
  </v-treeview>
</template>

<script>
import get from 'lodash/get';

export default {
  props: {
    activities: { type: Array, required: true },
    selected: { type: Object, default: null },
    search: { type: String, default: '' },
    schemaName: { type: String, required: true }
  },
  methods: {
    getIcon(children, open) {
      if (!children) return 'mdi-file-document-box';
      return open ? 'mdi-folder-open' : 'mdi-folder';
    },
    isPicked({ id }) {
      return get(this.selected, 'id') === id;
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
  text-align: left;
  overflow-y: scroll;
}
</style>
