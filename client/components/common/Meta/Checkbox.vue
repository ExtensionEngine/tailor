<template>
  <div class="control">
    <div v-if="meta.label" class="control-label">{{ meta.label }}</div>
    <v-checkbox
      @change="value => $emit('update', meta.key, value)"
      :input-value="meta.value"
      :name="meta.key"
      :label="meta.description"
      color="primary"
      class="mt-1" />
  </div>
</template>

<script>
export default {
  name: 'meta-checkbox',
  props: {
    meta: { type: Object, default: () => ({ value: null }) }
  }
};
</script>

<style lang="scss" scoped>
.control {
  padding: 3px 8px;

  ::v-deep label.v-label {
    margin-bottom: 0;
  }

  &-label {
    color: #0000008a;
    font-size: 0.875rem;
    font-weight: normal;
  }
}
</style>
