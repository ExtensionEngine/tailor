<template>
  <component
    :is="component"
    @update="(key, value) => $emit('update', key, value)"
    :meta="meta" />
</template>

<script>
import Checkbox from './Checkbox';
import ColorPicker from './ColorPicker';
import DatePicker from './DatePicker';
import FileUpload from './File';
import Input from './Input';
import mapKeys from 'lodash/mapKeys';
import Multiselect from './Multiselect';
import Select from './Select';
import Switch from './Switch';
import Textarea from './Textarea';

const META_TYPES = {
  CHECKBOX: Checkbox,
  COLOR: ColorPicker,
  DATE: DatePicker,
  DATETIME: DatePicker,
  INPUT: Input,
  SELECT: Select,
  MULTISELECT: Multiselect,
  SWITCH: Switch,
  TEXTAREA: Textarea,
  FILE: FileUpload
};
const components = mapKeys(META_TYPES, 'name');

export default {
  props: {
    meta: { type: Object, required: true }
  },
  computed: {
    type: vm => (vm.meta.type || '').toUpperCase(),
    component: vm => META_TYPES[vm.type] || META_TYPES.INPUT
  },
  components
};
</script>

<style lang="scss" scoped>
/deep/ .title {
  color: #808080;
  font-family: $font-family-secondary;
  font-size: 14px !important;
  font-weight: normal;
}
</style>
