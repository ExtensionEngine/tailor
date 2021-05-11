<template>
  <component
    :is="component"
    @update="(key, value) => $emit('update', key, value)"
    :meta="meta"
    :class="{ required: get(meta, 'validate.required') }" />
</template>

<script>
import Checkbox from './Checkbox';
import ColorPicker from './ColorPicker';
import Combobox from './Combobox';
import DatePicker from './DatePicker';
import FileUpload from './File';
import get from 'lodash/get';
import Html from './Html';
import Input from './Input';
import mapKeys from 'lodash/mapKeys';
import Select from './Select';
import Switch from './Switch';
import Textarea from './Textarea';

const META_TYPES = {
  CHECKBOX: Checkbox,
  COMBOBOX: Combobox,
  COLOR: ColorPicker,
  DATE: DatePicker,
  DATETIME: DatePicker,
  HTML: Html,
  INPUT: Input,
  SELECT: Select,
  MULTISELECT: Select,
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
  methods: { get },
  components
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
