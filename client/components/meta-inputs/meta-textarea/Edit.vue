<template>
  <validation-provider
    ref="validator"
    v-slot="{ errors }"
    :name="lowerCase(meta.label)"
    :rules="validationRules"
    slim>
    <v-textarea
      v-model="value"
      @change="onChange"
      :name="meta.key"
      :label="meta.label"
      :placeholder="meta.placeholder"
      :error-messages="errors"
      :messages="meta.messages"
      :rows="rows"
      auto-grow outlined
      class="my-2">
      <template #message="{ message }">
        <span :class="errors.length ? 'error--text' : 'warning--text'">
          {{ message }}
        </span>
      </template>
    </v-textarea>
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
  data: vm => ({ value: vm.meta.value }),
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
