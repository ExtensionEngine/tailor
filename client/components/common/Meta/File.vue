<template>
  <div class="control">
    <span class="title">{{ meta.label }}</span>
    <div class="form-group">
      <file-upload
        @upload="$emit('update', meta.key, $event)"
        @delete="$emit('update', meta.key, null)"
        v-bind="options" />
    </div>
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
.control {
  position: relative;
  min-height: 50px;
  padding: 7px 8px;

  &:hover {
    background-color: #f5f5f5;
  }

  &.editing:hover {
    background-color: inherit;
  }

  .form-group {
    margin: 10px 0 0;
  }
}
</style>
