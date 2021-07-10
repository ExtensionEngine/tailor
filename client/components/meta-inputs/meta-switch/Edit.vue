<template>
  <div class="px-1 pt-0 pb-10">
    <v-switch
      @change="$emit('update', meta.key, $event)"
      :input-value="meta.value"
      :name="meta.key"
      :label="meta.label"
      color="primary darken-1"
      hide-details />
  </div>
</template>

<script>
export default {
  name: 'meta-switch',
  props: {
    meta: { type: Object, default: () => ({ value: null }) }
  }
};
</script>

<style lang="scss" scoped>
::v-deep .v-label {
  margin-bottom: 0;
  padding-left: 0.375rem;
  font-size: 0.875rem;
}
</style>
