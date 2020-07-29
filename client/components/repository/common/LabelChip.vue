<template functional>
  <v-chip
    color="blue-grey lighten-5"
    class="font-weight-medium subtitle-2 text-uppercase"
    :class="[data.staticClass, data.class]"
    label small>
    <slot></slot>
  </v-chip>
</template>

<script>
export default { name: 'repository-label-chip' };
</script>
