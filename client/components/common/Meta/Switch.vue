<template>
  <div class="control">
    <span class="title">{{ meta.label }}</span>
    <v-switch
      @change="value => $emit('update', meta.key, value)"
      :input-value="meta.value"
      :name="meta.key"
      :label="meta.description"
      color="primary" />
  </div>
</template>

<script>
export default {
  name: 'switch-input',
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
}

.title {
  display: block;
  margin-bottom: 10px;
  color: #808080;
}
</style>
