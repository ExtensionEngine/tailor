<template functional>
  <div class="d-flex align-center">
    <v-icon class="priority-icon mr-2">
      {{ `$vuetify.icons.${props.icon}` }}
    </v-icon>
    {{ props.label }}
  </div>
</template>

<script>
export default {
  name: 'overview-priority',
  inheritAttrs: false,
  props: {
    label: { type: String, required: true },
    icon: { type: String, required: true }
  }
};
</script>

<style lang="scss" scoped>
.priority-icon {
  width: 0.75rem;
}
</style>
