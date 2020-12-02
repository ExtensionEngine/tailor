<template functional>
  <v-chip
    v-on="listeners"
    :class="[data.staticClass, data.class]"
    color="blue-grey lighten-5"
    label small
    class="readonly flex-shrink-0 caption text-uppercase">
    <slot></slot>
  </v-chip>
</template>

<script>
export default { name: 'repository-label-chip' };
</script>
