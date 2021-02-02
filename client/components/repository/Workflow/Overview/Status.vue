<template functional>
  <v-chip :color="props.color" label dark class="column-status readonly">
    {{ props.label }}
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
