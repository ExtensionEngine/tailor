<template>
  <v-text-field
    v-validate="meta.validate"
    v-model="value"
    :name="meta.key"
    :error-messages="vErrors.collect(meta.key)"
    :label="meta.label"
    :placeholder="meta.placeholder"
    @change="validateAndUpdate"
    outline/>
</template>

<script>
import { withValidation } from 'utils/validation';

export default {
  name: 'line-input',
  mixins: [withValidation()],
  props: {
    meta: { type: Object, default: () => ({ value: null }) }
  },
  data() {
    return {
      value: this.meta.value
    };
  },
  methods: {
    validateAndUpdate() {
      this.$validator.validate(this.meta.key).then(result => {
        if (!result) return;
        if (this.value === this.meta.value) return;
        this.$emit('update', this.meta.key, this.value);
      });
    }
  }
};
</script>
