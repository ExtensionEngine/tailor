<template>
  <div class="sidebar">
    <h3>Additional settings</h3>
    <element-metadata :inputs="inputs" :relationships="relationships" />
  </div>
</template>

<script>
import ElementMetadata from 'ElementMeta';

export default {
  name: 'element-sidebar',
  props: {
    element: { type: Object, required: true },
    inputs: { type: Array, required: true },
    relationships: { type: Array, default: () => [] }
  },
  components: { ElementMetadata }
};
</script>

<style lang="scss" scoped>
.sidebar {
  position: absolute;
  top: 3.125rem;
  right: 0;
  bottom: 0;
  width: 23.75rem;
  padding: 1.5625rem 0 4.6875rem 1.25rem;
  text-align: left;
  background: white;
  overflow-y: auto;
  z-index: 98;
  box-shadow:
    0 0.625rem 1.25rem rgba(0, 0, 0, 0.2),
    0 0.5rem 0.5rem rgba(0, 0, 0, 0.18);

  h3 {
    margin: 6.25rem 0.3125rem 1.25rem;
    font-size: 1.125rem;
  }
}
</style>
