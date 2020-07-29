<template functional>
  <v-chip
    color="blue-grey lighten-5"
    class="caption text-uppercase"
    :class="[data.staticClass, data.class]"
    label small>
    <slot></slot>
  </v-chip>
</template>

<script>
export default { name: 'repository-label-chip' };
</script>
