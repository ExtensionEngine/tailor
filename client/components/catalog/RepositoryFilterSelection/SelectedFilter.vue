<template>
  <v-chip
    @click:close="$emit('close')"
    close
    class="mx-2 mb-1">
    <v-icon left>{{ config.icon }}</v-icon>
    {{ name }}
  </v-chip>
</template>

<script>
export default {
  name: 'selected-repository-filter',
  inheritAttrs: false,
  props: {
    name: { type: String, required: true },
    config: { type: Object, required: true }
  }
};
</script>

<style lang="scss" scoped>
.v-chip {
  height: 1.75rem !important;

  // the dense styling gets overruled by the chips styling
  ::v-deep .v-icon.v-icon--left {
    margin-right: 0.25rem;
    font-size: 1.25rem !important;
  }
}
</style>
