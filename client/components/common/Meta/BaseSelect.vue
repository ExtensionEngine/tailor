<template>
  <v-select
    :value="meta.value"
    :name="meta.key"
    :items="meta.options"
    :placeholder="meta.placeholder"
    :label="meta.label"
    :multiple="isMultiSelect"
    :chips="isMultiSelect"
    @change="update"
    item-text="label"
    item-value="value"
    deletable-chips
    outline>
  </v-select>
</template>

<script>
import isObject from 'lodash/isObject';

export default {
  name: 'meta-select',
  props: {
    meta: { type: Object, default: () => ({ value: null }) }
  },
  data: () => ({ active: false }),
  computed: {
    isMultiSelect() {
      return this.meta.type === 'MULTISELECT';
    },
    isCollection() {
      return isObject(this.meta.options[0]);
    }
  },
  methods: {
    update(data) {
      const { isCollection, meta: { options } } = this;
      if (isCollection) {
        data = data.map(it => options.find(({ value }) => value === it));
      }
      return this.$emit('update', this.meta.key, data);
    }
  }
};
</script>
