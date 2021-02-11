<template>
  <v-chip :color="color" label dark small class="readonly">
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
