<template>
  <validation-provider
    ref="provider"
    v-slot="{ errors }"
    :name="meta.label | loweCase"
    :rules="meta.validate">
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
  methods: {
    async onChange() {
      const { valid } = await this.$refs.provider.validate();
      if (!valid) return;
      if (this.value === this.meta.value) return;
      this.$emit('update', this.meta.key, this.value);
    }
  },
  filters: { lowerCase }
};
</script>
