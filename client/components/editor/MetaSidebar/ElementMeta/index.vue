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
import { mapActions } from 'vuex';
import MetaInput from '@/components/common/Meta';

export default {
  name: 'element-metadata',
  props: {
    element: { type: Object, required: true },
    inputs: { type: Array, default: () => [] },
    relationships: { type: Array, default: () => [] }
  },
  methods: {
    ...mapActions('repository/tes', ['update']),
    updateElement(key, value) {
      const meta = { ...this.element.meta };
      meta[key] = value;
      return this.update({ _cid: this.element._cid, meta });
    }
  },
  components: { MetaInput, ElementRelationships }
};
</script>
