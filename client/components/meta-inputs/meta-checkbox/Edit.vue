<template>
  <div class="control">
    <div v-if="meta.label" class="control-label">{{ meta.label }}</div>
    <v-checkbox
      @change="value => $emit('update', meta.key, value)"
      :input-value="meta.value"
      :name="meta.key"
      :label="meta.description"
      color="primary darken-2"
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
    font-size: 0.875rem;
    font-weight: normal;
    text-align: left;
    color: #0000008a;
  }
}
</style>
