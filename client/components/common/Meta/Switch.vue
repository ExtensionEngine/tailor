<template>
  <div class="control">
    <span class="title">{{ meta.label }}</span>
    <v-switch
      v-model="value"
      @change="$emit('update', meta.key, value)"
      :id="meta.key"
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
  },
  data() {
    return { value: this.meta.value };
  }
};
</script>

<style lang="scss" scoped>
.control {
  padding: 3px 8px;

  /deep/ label.v-label {
    margin-bottom: 0;
  }
}

.title {
  display: block;
  margin-bottom: 10px;
  color: #808080;
}
</style>
