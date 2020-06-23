<template>
  <component
    :is="component"
    @update="(key, value) => $emit('update', key, value)"
    :meta="meta"
    :class="{ required: get(meta, 'validate.required') }" />
</template>

<script>
import get from 'lodash/get';
import { getMetaName } from 'tce-core/utils';

// Handle this better
const subtypes = {
  DATE: 'DATETIME',
  MULTISELECT: 'SELECT'
};

export default {
  name: 'meta-input-wrapper',
  props: {
    meta: { type: Object, required: true }
  },
  computed: {
    type: vm => (subtypes[vm.meta.type] || vm.meta.type || '').toUpperCase(),
    component: vm => getMetaName(vm.type)
  },
  methods: { get }
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
