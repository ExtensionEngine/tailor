<template>
  <validation-provider
    ref="validator"
    v-slot="{ errors }"
    :name="meta.label.toLowerCase()"
    :rules="validationRules"
    tag="div"
    slim
    class="control">
    <div v-if="meta.label" class="control-label">{{ meta.label }}</div>
    <v-checkbox
      v-model="value"
      @change="update"
      :input-value="meta.value"
      :name="meta.key"
      :label="meta.description"
      :error-messages="errors"
      color="primary darken-2"
      class="mt-1" />
  </validation-provider>
</template>

<script>
import get from 'lodash/get';

export default {
  name: 'meta-checkbox',
  props: {
    meta: { type: Object, default: () => ({ value: null }) }
  },
  data: vm => ({ value: vm.meta.value }),
  computed: {
    validationRules: vm => get(vm.meta, 'validate.rules', vm.meta.validate)
  },
  methods: {
    async update(data) {
      const { valid } = await this.$refs.validator.validate();
      if (!valid || this.value === this.meta.value) return;
      return this.$emit('update', this.meta.key, data);
    }
  }
};
</script>

<style lang="scss" scoped>
.control {
  padding: 0.1875rem 0.5rem;

  ::v-deep label.v-label {
    margin-bottom: 0;
  }

  &-label {
    color: #0000008a;
    font-size: 0.875rem;
    font-weight: normal;
    text-align: left;
  }
}
</style>
