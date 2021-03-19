<template>
  <validation-provider
    ref="validator"
    v-slot="{ errors }"
    :name="meta.label.toLowerCase()"
    :rules="validationRules"
    slim>
    <v-combobox
      v-model="value"
      @change="update"
      :value="meta.value"
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
    async update(value) {
      const { valid } = await this.$refs.validator.validate();
      if (!valid || this.value === this.meta.value) return;
      this.$emit('update', this.meta.key, value);
    }
  }
};
</script>
