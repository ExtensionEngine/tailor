<template>
  <validation-provider
    ref="metaKey"
    v-slot="{ errors }"
    :rules="meta.validate"
    name="metaKey">
    <v-textarea
      v-model="value"
      @change="onChange"
      :name="meta.key"
      :data-vv-as="meta.label"
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
  methods: {
    async onChange() {
      const { valid } = await this.$refs.metaKey.validate();
      if (!valid) return;
      if (this.value === this.meta.value) return;
      this.$emit('update', this.meta.key, this.value);
    }
  }
};
</script>
