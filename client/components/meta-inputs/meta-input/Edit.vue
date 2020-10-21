<template>
  <validation-provider
    ref="validator"
    v-slot="{ errors }"
    :name="lowerCase(meta.label)"
    :rules="validationRules"
    slim>
    <v-text-field
      v-model="value"
      @change="onChange"
      :name="meta.key"
      :label="meta.label"
      :placeholder="meta.placeholder"
      :error-messages="errors"
      outlined
      class="my-2" />
  </validation-provider>
</template>

<script>
import get from 'lodash/get';
import lowerCase from 'lodash/lowerCase';

export default {
  name: 'meta-input',
  props: {
    meta: { type: Object, default: () => ({ value: null }) }
  },
  data() {
    return {
      value: this.meta.value
    };
  },
  computed: {
    validationRules: vm => get(vm.meta, 'validate.rules', vm.meta.validate)
  },
  methods: {
    lowerCase,
    async onChange() {
      const { valid } = await this.$refs.validator.validate();
      if (!valid) return;
      if (this.value === this.meta.value) return;
      this.$emit('update', this.meta.key, this.value);
    }
  }
};
</script>
