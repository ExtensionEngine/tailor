<template>
  <v-chip
    v-on="$listeners"
    :color="color"
    text-color="black"
    label small
    class="flex-shrink-0 caption text-uppercase readonly">
    <slot></slot>
  </v-chip>
</template>

<script>
export default {
  name: 'repository-label-chip',
  props: {
    color: { type: String, default: 'primary lighten-5' }
  }
};
</script>
