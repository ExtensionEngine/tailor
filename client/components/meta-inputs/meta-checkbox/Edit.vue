<template>
  <validation-provider
    ref="validator"
    v-slot="{ errors }"
    :name="lowerCase(meta.label)"
    :rules="validationRules"
    tag="div"
    class="control">
    <div v-if="meta.label" class="control-label">{{ meta.label }}</div>
    <v-checkbox
      v-model="value"
      @change="update"
      :name="meta.key"
      :label="meta.description"
      :error-messages="errors"
      color="primary darken-2"
      class="mt-1" />
  </validation-provider>
</template>

<script>
import debounce from 'lodash/debounce';
import get from 'lodash/get';
import lowerCase from 'lodash/lowerCase';

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
    lowerCase,
    update: debounce(async function (value) {
      const { valid } = await this.$refs.validator.validate();
      if (!valid) return;
      this.$emit('update', this.meta.key, value);
    }, 200)
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
