<template>
  <div class="element-sidebar">
    <h3 class="body-1">Additional settings</h3>
    <element-meta :element="element" v-bind="metadata" />
  </div>
</template>

<script>
import ElementMeta from './ElementMeta';

export default {
  name: 'element-sidebar',
  props: {
    element: { type: Object, required: true },
    metadata: { type: Object, default: () => ({}) }
  },
  components: { ElementMeta }
};
</script>

<style lang="scss" scoped>
.element-sidebar {
  position: absolute;
  top: 0.5rem;
  right: 0;
  bottom: 0;
  width: 22.5rem;
  padding: 1.5rem 0.875rem 4.75rem;
  text-align: left;
  background: #fff;
  overflow-y: auto;
  z-index: 98;

  h3 {
    margin: 6.25rem 0.25rem 1.5rem;
  }
}
</style>
