<template>
  <v-select
    v-on="$listeners"
    v-bind="$attrs"
    :value="selected.id"
    :items="items"
    label="Priority"
    item-text="label"
    item-value="id"
    class="priority-select"
    outlined>
    <template #prepend-inner>
      <v-icon class="icon mr-1">
        $vuetify.icons.{{ selected.icon }}
      </v-icon>
    </template>
    <template #item="{ item }">
      <v-icon class="icon mr-3">
        $vuetify.icons.{{ item.icon }}
      </v-icon>
      <span>{{ item.label }}</span>
    </template>
  </v-select>
</template>

<script>
export default {
  name: 'workflow-board-select-priority',
  props: {
    value: { type: String, default: null },
    items: { type: Array, default: () => ([]) }
  },
  computed: {
    selected() {
      return this.items.find(it => it.id === this.value) || {};
    }
  }
};
</script>

<style lang="scss" scoped>
.priority-select ::v-deep {
  .v-input__prepend-inner {
    margin-top: auto;
    margin-bottom: auto;
  }
}
.icon {
  width: 16px;
}
</style>
