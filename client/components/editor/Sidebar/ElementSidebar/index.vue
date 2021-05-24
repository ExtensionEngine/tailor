<template>
  <div class="element-sidebar">
    <h3 class="body-1">Additional settings</h3>
    <element-meta :element="element" v-bind="metadata" />
  </div>
</template>

<script>
import ElementMeta from './ElementMeta';
import { getElementId } from '@tailor-cms/utils';

export default {
  name: 'element-sidebar',
  props: {
    element: { type: Object, required: true },
    metadata: { type: Object, default: () => ({}) }
  },
  computed: {
    id: vm => getElementId(vm.element),
    elementBus: vm => vm.$radio.channel(`element:${vm.id}`)
  },
  provide() {
    return {
      $elementBus: this.elementBus
    };
  },
  components: { ElementMeta }
};
</script>

<style lang="scss" scoped>
.element-sidebar {
  padding: 1.75rem 0.875rem 1.5rem;

  h3 {
    margin: 0 0.25rem 1.5rem;
  }
}
</style>
