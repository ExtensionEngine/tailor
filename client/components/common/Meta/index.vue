<template>
  <component
    :is="resolveComponent(meta.type)"
    :meta="meta"
    @update="(key, value) => $emit('update', key, value)">
  </component>
</template>

<script>
import Checkbox from './Checkbox';
import ColorPicker from './ColorPicker';
import DatePicker from './DatePicker';
import FileUpload from './File';
import Input from './Input';
import mapKeys from 'lodash/mapKeys';
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
  SWITCH: Switch,
  TEXTAREA: Textarea,
  UPLOAD: FileUpload
};
const components = mapKeys(META_TYPES, 'name');

export default {
  props: {
    meta: { type: Object, required: true }
  },
  methods: {
    resolveComponent(type = '') {
      return META_TYPES[type.toUpperCase()] || META_TYPES.INPUT;
    }
  },
  components
};
</script>
