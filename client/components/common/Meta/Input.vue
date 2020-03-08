<template>
  <v-text-field
    v-model="value"
    v-validate="meta.validate ? meta.validate.rules : {}"
    @change="onChange"
    :name="meta.key"
    :data-vv-as="meta.label"
    :label="meta.label"
    :placeholder="meta.placeholder"
    :error-messages="vErrors.collect(meta.key)"
    outlined
    class="my-2" />
</template>

<script>
import { withValidation } from 'utils/validation';

export default {
  name: 'meta-input',
  mixins: [withValidation({ inherit: true })],
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
      const isValid = await this.$validator.validate(this.meta.key);
      if (!isValid) return;
      if (this.value === this.meta.value) return;
      this.$emit('update', this.meta.key, this.value);
    }
  }
};
</script>
