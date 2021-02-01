<template functional>
  <span
    :style="{ 'background-color': props.color }"
    class="status px-2 py-1 rounded">
    {{ props.label }}
  </span>
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
.status {
  color: var(--text-color-default);
}
</style>
