<template>
  <div class="meta-file">
    <label class="meta-name">{{ meta.label }}</label>
    <file-upload
      @upload="$emit('update', meta.key, $event)"
      @delete="$emit('update', meta.key, null)"
      v-bind="options" />
  </div>
</template>

<script>
import FileUpload from '../FileUpload.vue';
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
        validate: this.meta.validate,
        label: this.meta.placeholder
      };
    }
  },
  components: { FileUpload }
};
</script>

<style lang="scss" scoped>
.meta-file {
  position: relative;
  min-height: 50px;
  margin: 20px 0;
  padding: 3px 8px;

  &:hover {
    background-color: #f5f5f5;
  }

  &.editing:hover {
    background-color: inherit;
  }

  .meta-name {
    width: 100%;
    margin-bottom: 10px;
    color: #808080;
  }
}
</style>
