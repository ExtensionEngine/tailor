<template>
  <div class="tce-table-toolbar">
    <v-menu offset-y>
      <template v-slot:activator="{ on }">
        <v-btn v-on="on" text tile class="dropdown-toggle ml-3">
          <v-icon left small>mdi-table</v-icon>
          Table
        </v-btn>
      </template>
      <v-list>
        <v-list-item
          v-for="action in actions"
          :key="action.name"
          @click="trigger(action.name)">
          {{ action.label }}
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
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
.tce-table-toolbar {
  position: relative;
  width: 100%;
  height: 48px;

  > * {
    float: left;
    height: 100%;
    margin: 0;
    padding: 0 10px;
  }

  .dropdown-toggle {
    height: 100%;
  }

  .quill-options {
    height: 100%;
    padding-top: 13px;
  }

  .quill-group {
    padding-left: 5px;
  }
}

.tce-table-toolbar.ql-toolbar.ql-snow {
  padding: 0;
  border: none;
  font-family: inherit;
}
</style>
