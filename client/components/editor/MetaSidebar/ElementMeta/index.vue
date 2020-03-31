<template>
  <div class="element-metadata">
    <div v-if="inputs.length" class="meta-inputs">
      <meta-input
        v-for="input in inputs"
        :key="`${element._cid}.${input.key}`"
        @update="updateElement"
        :meta="input" />
    </div>
    <element-relationships
      v-if="relationships.length"
      :element="element"
      :relationships="relationships" />
  </div>
</template>

<script>
import ElementRelationships from './Relationships';
import MetaInput from '@/components/common/Meta';

export default {
  name: 'element-metadata',
  props: {
    element: { type: Object, required: true },
    inputs: { type: Array, default: () => [] },
    relationships: { type: Array, default: () => [] }
  },
  components: { MetaInput, ElementRelationships }
};
</script>
