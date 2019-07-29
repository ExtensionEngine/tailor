<template>
  <v-textarea
    v-model="value"
    v-validate="meta.validate"
    @change="validateAndUpdate"
    :error-messages="vErrors.collect(meta.key)"
    :label="meta.label"
    :name="meta.key"
    :placeholder="meta.placeholder"
    :rows="rows"
    auto-grow
    outline />
</template>

<script>
import { withValidation } from 'utils/validation';

export default {
  name: 'multiline-input',
  mixins: [withValidation()],
  props: {
    meta: { type: Object, default: () => ({ value: null }) },
    rows: { type: Number, default: 2 }
  },
  data() {
    return {
      value: this.meta.value
    };
  },
  methods: {
    validateAndUpdate() {
      this.$validator.validateAll().then(result => {
        if (!result) return;
        if (this.value === this.meta.value) return;
        this.$emit('update', this.meta.key, this.value);
      });
    }
  }
};
</script>
