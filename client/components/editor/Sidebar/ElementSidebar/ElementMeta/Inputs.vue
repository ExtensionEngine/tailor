<template>
  <div class="meta-inputs">
    <meta-input
      v-for="input in inputs"
      :key="`${id}.${input.key}`"
      @update="updateElement"
      :meta="input" />
  </div>
</template>

<script>
import { getElementId } from '@tailor-cms/utils';
import MetaInput from '@/components/common/MetaInput.vue';

export default {
  name: 'element-meta-inputs',
  inject: ['$elementBus'],
  props: {
    element: { type: Object, required: true },
    inputs: { type: Array, default: () => [] }
  },
  computed: {
    id: vm => getElementId(vm.element)
  },
  methods: {
    updateElement(key, value) {
      const meta = { ...this.element.meta };
      meta[key] = value;
      this.$elementBus.emit('save:meta', meta);
    }
  },
  components: { MetaInput }
};
</script>
