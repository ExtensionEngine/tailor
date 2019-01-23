<template>
  <div class="meta-file-upload">
    <label class="meta-name">{{ meta.label }}</label>
    <file-upload
      v-bind="fileOptions"
      @key="updateActivity"
      @delete="updateActivity">
    </file-upload>
  </div>
</template>

<script>
import FileUpload from '../FileUpload.vue';
import get from 'lodash/get';

export default {
  name: 'file',
  props: {
    meta: { type: Object, default: () => ({ value: null }) }
  },
  computed: {
    fileOptions() {
      return {
        id: this.meta.key,
        fileName: get(this.meta, 'value.name', ''),
        fileUrl: get(this.meta, 'value.url', ''),
        validate: this.meta.validate
      };
    }
  },
  methods: {
    updateActivity(url, name) {
      let update = null;
      if (url && name) update = { url, name };
      return this.$emit('update', this.meta.key, update);
    }
  },
  components: {
    FileUpload
  }
};
</script>

<style lang="scss" scoped>
.meta-file-upload {
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
