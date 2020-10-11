<template>
  <v-toolbar color="transparent" class="tce-table-toolbar elevation-0">
    <v-toolbar-items>
      <v-menu bottom>
        <template v-slot:activator="{ on }">
          <v-btn v-on="on" text>
            Table options
            <v-icon>mdi-chevron-down</v-icon>
          </v-btn>
        </template>
        <v-list class="text-left">
          <v-list-item
            v-for="action in actions"
            :key="action.name"
            @click="trigger(action.name)">
            <v-list-item-title>{{ action.label }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-toolbar-items>
  </v-toolbar>
</template>

<script>
const actions = () => [
  { name: 'addRowBefore', label: 'Add row before' },
  { name: 'addRowAfter', label: 'Add row after' },
  { name: 'addColumnBefore', label: 'Add column before' },
  { name: 'addColumnAfter', label: 'Add column after' },
  { name: 'removeRow', label: 'Delete row' },
  { name: 'removeColumn', label: 'Delete column' }
];

export default {
  name: 'tce-table-toolbar',
  inject: ['$elementBus'],
  props: {
    element: { type: Object, required: true },
    embed: { type: Object, default: null }
  },
  computed: { actions },
  methods: {
    trigger(action) {
      this.$elementBus.emit(action, this.embed.id);
    }
  }
};
</script>

<style lang="scss" scoped>
::v-deep .v-toolbar__content {
  padding-left: 0;
}

.tce-table-toolbar.ql-toolbar.ql-snow {
  padding: 0;
  border: none;
  font-family: inherit;
}
</style>
