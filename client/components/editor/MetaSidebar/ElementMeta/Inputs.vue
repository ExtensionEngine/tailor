<template>
  <div class="meta-inputs">
    <meta-input
      v-for="input in inputs"
      :key="`${element._cid}.${input.key}`"
      @update="updateElement"
      :meta="input" />
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'element-meta-inputs',
  props: {
    element: { type: Object, required: true },
    inputs: { type: Array, default: () => [] }
  },
  methods: {
    ...mapActions('repository/tes', ['update']),
    updateElement(key, value) {
      const meta = { ...this.element.meta };
      meta[key] = value;
      return this.update({ _cid: this.element._cid, meta });
    }
  }
};
</script>
