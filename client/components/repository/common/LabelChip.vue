<template functional>
  <v-chip
    v-on="listeners"
    :class="[data.staticClass, data.class, { active: listeners.mouseenter }]"
    color="blue-grey lighten-5"
    label small
    class="chip flex-shrink-0 caption text-uppercase">
    <slot></slot>
  </v-chip>
</template>

<script>
export default { name: 'repository-label-chip' };
</script>

<style lang="scss" scoped>
.chip:not(.active)::before {
  opacity: 0;
}
</style>
