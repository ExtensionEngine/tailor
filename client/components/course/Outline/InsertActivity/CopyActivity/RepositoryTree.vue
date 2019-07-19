<template>
  <div v-if="!activities.length" class="ma-3">Repository is empty.</div>
  <v-treeview
    v-else
    ref="treeview"
    :items="activities"
    :search="search"
    transition
    open-all
    class="ma-2 treeview">
    <template v-slot:prepend="{ item, open }">
      <v-icon>{{ getIcon(item.children, open) }}</v-icon>
    </template>
    <template v-slot:append="{ item }">
      <v-btn
        v-if="item.supported"
        :class="{ picked: isPicked(item) }"
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
    search: { type: String, default: '' }
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

  .picked {
    color: #337ab7;
  }
}
</style>
