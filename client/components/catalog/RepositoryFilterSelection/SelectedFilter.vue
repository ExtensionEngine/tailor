<template>
  <v-chip
    @click:close="$emit('close')"
    close
    class="mx-2 mb-1">
    <v-icon left>{{ icon }}</v-icon>
    {{ name }}
  </v-chip>
</template>

<script>
export default {
  name: 'selected-filter-option',
  inheritAttrs: false,
  props: {
    name: { type: String, required: true },
    icon: { type: String, required: true }
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
