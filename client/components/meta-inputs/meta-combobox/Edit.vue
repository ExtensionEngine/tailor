<template>
  <validation-provider
    ref="validator"
    v-slot="{ errors }"
    :name="lowerCase(meta.label)"
    :rules="validationRules"
    slim>
    <v-combobox
      v-model="value"
      @change="update"
      :name="meta.key"
      :items="meta.options"
      :placeholder="meta.placeholder"
      :label="meta.label"
      :multiple="meta.multiple"
      :chips="meta.multiple"
      :error-messages="errors"
      item-text="label"
      item-value="value"
      deletable-chips clearable outlined />
  </validation-provider>
</template>

<script>
import get from 'lodash/get';
import isObject from 'lodash/isObject';
import last from 'lodash/last';
import lowerCase from 'lodash/lowerCase';

function processValue(val) {
  if (!Array.isArray(val)) return val?.trim();
  return val.map(item => isObject(item) ? item.value : item);
}

export default {
  name: 'meta-combobox',
  props: {
    meta: { type: Object, default: () => ({ value: null }) }
  },
  data: vm => ({ value: vm.meta.value }),
  computed: {
    validationRules: vm => get(vm.meta, 'validate.rules', vm.meta.validate)
  },
  methods: {
    lowerCase,
    async update(val) {
      const value = processValue(val);
      const isEmpty = value?.length && !last(value).trim();
      if (isEmpty) return value.pop();
      const { valid } = await this.$refs.validator.validate();
      if (!valid) return;
      this.$emit('update', this.meta.key, value);
    }
  }
};
</script>
