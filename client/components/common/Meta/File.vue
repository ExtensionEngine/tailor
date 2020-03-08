<template>
  <file-input
    @upload="$emit('update', meta.key, $event)"
    @delete="$emit('update', meta.key, null)"
    v-bind="options"
    outlined />
</template>

<script>
import FileInput from '../FileInput';
import get from 'lodash/get';

export default {
  name: 'meta-file',
  props: {
    meta: { type: Object, default: () => ({ value: null }) }
  },
  computed: {
    options() {
      return {
        id: this.meta.key,
        fileKey: get(this.meta, 'value.key', ''),
        fileName: get(this.meta, 'value.name', ''),
        validate: get(this.meta, 'validate.rules', {}),
        label: this.meta.label,
        placeholder: this.meta.placeholder
      };
    }
  },
  components: { FileInput }
};
</script>
