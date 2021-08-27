<template>
  <div>
    <v-icon class="priority-icon mr-2">
      {{ `$vuetify.icons.${icon}` }}
    </v-icon>
    {{ label }}
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
