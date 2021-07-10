<template>
  <file-input
    @upload="$emit('update', meta.key, $event)"
    @delete="$emit('update', meta.key, null)"
    v-bind="options"
    outlined />
</template>

<script>
import { FileInput } from '@tailor-cms/core-components';
import get from 'lodash/get';

export default {
  name: 'meta-file',
  props: {
    meta: { type: Object, default: () => ({ value: null }) }
  },
  computed: {
    options: ({ meta }) => ({
      id: meta.key,
      fileKey: get(meta, 'value.key', ''),
      fileName: get(meta, 'value.name', ''),
      validate: meta.validate,
      label: meta.label,
      placeholder: meta.placeholder
    })
  },
  components: { FileInput }
};
</script>
