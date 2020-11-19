<template>
  <v-combobox
    @change="$emit('update', meta.key, $event)"
    :value="meta.value"
    :name="meta.key"
    :items="meta.options"
    :placeholder="meta.placeholder"
    :label="meta.label"
    :multiple="meta.multiple"
    :chips="meta.multiple"
    item-text="label"
    item-value="value"
    deletable-chips
    outlined />
</template>

<script>
import isObject from 'lodash/isObject';

export default {
  name: 'meta-combobox',
  props: {
    meta: { type: Object, default: () => ({ value: null }) }
  },
  computed: {
    value() {
      const { meta: { value, options } } = this;
      const hasPrimitiveOptions = !isObject(options[0]);
      if (hasPrimitiveOptions) return value;
      return value.map(val => options.find(it => it.value === val));
    }
  }
};
</script>
