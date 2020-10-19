<template functional>
  <v-chip
    v-on="listeners"
    :class="[data.staticClass, data.class, { active: listeners.mouseenter }]"
    color="blue-grey lighten-5"
    class="chip caption text-uppercase"
    label small>
    <slot></slot>
  </v-chip>
</template>

<script>
export default { name: 'repository-label-chip' };
</script>

<style lang="scss" scoped>
.chip.v-chip {
  flex-shrink: 0;

  &:not(.active)::before {
    opacity: 0;
  }
}
</style>
