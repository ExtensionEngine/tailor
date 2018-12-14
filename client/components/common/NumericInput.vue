<template>
  <input v-model="localValue" v-bind="$attrs" @input="handleErrors">
</template>

<script>
import { withValidation } from 'utils/validation';

export default {
  name: 'v-input',
  mixins: [withValidation({ inherit: true })],
  inheritAttrs: false,
  props: {
    value: { type: null, default: null }
  },
  data() {
    return {
      localValue: this.value
    };
  },
  computed: {
    isNumeric() {
      return this.$attrs.type === 'number';
    },
    field() {
      return this.$attrs.id;
    },
    scope() {
      return this.$attrs.scope;
    },
    msg() {
      const label = this.$attrs['data-vv-as'];
      return `The ${label} field may only contain numeric characters.`;
    }
  },
  methods: {
    handleErrors() {
      const { field, vErrors, isNumeric, scope, localValue, msg } = this;
      this.upsertError({ field, vErrors, scope, msg });
      if (!isNumeric || !this.$el.validity.badInput) vErrors.remove(field, scope);
      this.$emit('input', localValue);
    },
    upsertError({ field, vErrors, scope, msg }) {
      vErrors.update(field, { msg, scope }) || vErrors.add({ field, msg, scope });
    }
  }
};
</script>
