<template>
  <v-textarea
    v-model="value"
    v-validate="meta.validate"
    @change="onChange"
    :error-messages="vErrors.collect(meta.key)"
    :label="meta.label"
    :name="meta.key"
    :placeholder="meta.placeholder"
    :rows="rows"
    auto-grow
    box
    class="my-2" />
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
    onChange() {
      this.$validator.validateAll().then(isValid => {
        if (!isValid) return;
        if (this.value === this.meta.value) return;
        this.$emit('update', this.meta.key, this.value);
      });
    }
  }
};
</script>
