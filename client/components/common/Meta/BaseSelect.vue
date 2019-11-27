<template>
  <v-select
    @change="update"
    :value="meta.value"
    :name="meta.key"
    :items="meta.options"
    :placeholder="meta.placeholder"
    :label="meta.label"
    :multiple="isMultiSelect"
    :chips="isMultiSelect"
    item-text="label"
    item-value="value"
    deletable-chips
    outlined />
</template>

<script>
import isObject from 'lodash/isObject';

export default {
  name: 'meta-select',
  props: {
    meta: { type: Object, default: () => ({ value: null }) }
  },
  computed: {
    isMultiSelect() {
      return this.meta.type === 'MULTISELECT';
    },
    areOptionsPrimitive() {
      return !isObject(this.meta.options[0]);
    },
    value() {
      const { meta: { value, options }, areOptionsPrimitive } = this;
      if (areOptionsPrimitive) return value;
      return value.map(val => options.find(it => it.value === val));
    }
  },
  methods: {
    update(data) {
      return this.$emit('update', this.meta.key, data);
    }
  }
};
</script>

<style lang="scss" scoped>
::v-deep .v-list-item__content {
  flex: initial;
}
</style>
