<template>
  <validation-provider
    ref="metaKey"
    v-slot="{ errors }"
    :name="meta.label | lowerCase"
    :rules="meta.validate">
    <v-textarea
      v-model="value"
      @change="onChange"
      :name="meta.key"
      :label="meta.label"
      :placeholder="meta.placeholder"
      :error-messages="errors"
      :rows="rows"
      auto-grow
      outlined
      class="my-2" />
  </validation-provider>
</template>

<script>
import get from 'lodash/get';
import lowerCase from 'lodash/lowerCase';

export default {
  name: 'meta-textarea',
  props: {
    meta: { type: Object, default: () => ({ value: null }) },
    rows: { type: Number, default: 2 }
  },
  data() {
    return {
      value: this.meta.value
    };
  },
  computed: {
    validate() {
      return get(this.meta, 'validate.rules');
    }
  },
  methods: {
    async onChange() {
      const { valid } = await this.$refs.metaKey.validate();
      if (!valid) return;
      if (this.value === this.meta.value) return;
      this.$emit('update', this.meta.key, this.value);
    }
  },
  filters: { lowerCase }
};
</script>
