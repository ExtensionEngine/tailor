<template>
  <v-select v-on="$listeners" v-bind="$attrs" clearable>
    <template #selection="{ item }">
      <div class="selection d-flex flex-nowrap">
        <v-icon :color="item.color" small class="mr-2">mdi-circle</v-icon>
        <span class="text--default text-truncate">{{ item.text }}</span>
      </div>
    </template>
    <template #item="{ item }">
      <v-icon :color="item.color" small class="mr-2">mdi-circle</v-icon>
      <span class="text--default">{{ item.text }}</span>
    </template>
  </v-select>
</template>

<script>
export default { name: 'workflow-filters-status' };
</script>

<style lang="scss" scope>
.selection {
  max-width: 100%;
}
</style>
