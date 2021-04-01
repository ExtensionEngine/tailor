<template>
  <v-select v-on="$listeners" v-bind="{ ...$attrs, itemText, itemValue }">
    <template #selection="{ item }">
      <div class="selection d-flex flex-nowrap">
        <v-icon :color="item.color" small class="mr-2">mdi-circle</v-icon>
        <span class="text--default text-truncate">{{ item.label }}</span>
      </div>
    </template>
    <template #item="{ item }">
      <v-icon :color="item.color" small class="mr-2">mdi-circle</v-icon>
      <span class="text--default">{{ item.label }}</span>
    </template>
  </v-select>
</template>

<script>
export default {
  name: 'select-workflow-status',
  props: {
    itemText: { type: String, default: 'label' },
    itemValue: { type: String, default: 'id' }
  }
};
</script>

<style lang="scss" scoped>
.selection {
  max-width: 100%;
}
</style>
