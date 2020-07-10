<template>
  <component
    :is="component"
    @update="(key, value) => $emit('update', key, value)"
    :meta="metaInput"
    :class="{ required: get(metaInput, 'validate.required') }" />
</template>

<script>
import get from 'lodash/get';
import { getMetaName } from 'tce-core/utils';

// TODO: Remove deprecated types in v5.0
const getDeprecationWarning = (deprecatedType, type, config) =>
  `Deprecation notice:
    '${deprecatedType}' meta type is deprecated and will be removed in v5.0.
    Please use '${type}' instead with following config added: ${config}.`;

const deprecatedTypes = {
  DATE: {
    type: 'DATETIME',
    config: { hideTime: true },
    deprecationWarning: getDeprecationWarning('DATE', 'DATETIME', '{ hideTime: true }')
  },
  MULTISELECT: {
    type: 'SELECT',
    config: { multiple: true },
    deprecationWarning: getDeprecationWarning('MULTISELECT', 'SELECT', '{ multiple: true }')
  }
};

export default {
  name: 'meta-input-wrapper',
  props: {
    meta: { type: Object, required: true }
  },
  computed: {
    originalType: vm => (vm.meta.type || '').toUpperCase(),
    type: vm => get(deprecatedTypes[vm.originalType], 'type', vm.originalType),
    metaInput: vm => {
      if (!deprecatedTypes[vm.originalType]) return vm.meta;
      return { ...vm.meta, ...deprecatedTypes[vm.originalType].config };
    },
    component: vm => getMetaName(vm.type)
  },
  methods: { get },
  watch: {
    type: {
      handler() {
        if (!deprecatedTypes[this.originalType]) return;
        console.warn(deprecatedTypes[this.originalType].deprecationWarning);
      },
      immediate: true
    }
  }
};
</script>

<style lang="scss" scoped>
::v-deep .title {
  color: #808080;
  font-family: $font-family-secondary;
  font-size: 14px !important;
  font-weight: normal;
}
</style>
