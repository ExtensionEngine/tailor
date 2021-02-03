<template>
  <v-chip
    :color="color"
    label dark
    class="column-status readonly">
    {{ label }}
  </v-chip>
</template>

<script>
export default {
  name: 'overview-status',
  inheritAttrs: false,
  props: {
    label: { type: String, required: true },
    color: { type: String, required: true }
  }
};
</script>

<style lang="scss" scoped>
.column-status {
  color: var(--text-color-default);
}
</style>
