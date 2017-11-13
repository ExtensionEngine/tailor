<template>
  <component
    :is="tagname(meta.type)"
    :meta="meta"
    @update="(key, value) => $emit('update', key, value)">
  </component>
</template>

<script>
import Checkbox from './Checkbox';
import ColorPicker from './ColorPicker/';
import Input from './Input';
import Select from './Select';
import Switch from './Switch';
import Textarea from './Textarea';

const META_TYPES = {
  CHECKBOX: Checkbox,
  COLOR: ColorPicker,
  INPUT: Input,
  SELECT: Select,
  SWITCH: Switch,
  TEXTAREA: Textarea
};

export default {
  props: ['meta'],
  methods: {
    tagname(type = '') {
      const component = META_TYPES[type.toUpperCase()] || META_TYPES.INPUT;
      return component.name;
    }
  },
  components: {
    [Checkbox.name]: Checkbox,
    [Input.name]: Input,
    [Select.name]: Select,
    [Switch.name]: Switch,
    [Textarea.name]: Textarea,
    ColorPicker
  }
};
</script>

