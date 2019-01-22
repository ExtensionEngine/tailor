<template>
  <div class="meta-file-upload">
    <label class="meta-name">{{ meta.label }}</label>
    <file-upload
      :meta="meta"
      @key="updateActivity"
      @delete="updateActivity">
    </file-upload>
  </div>
</template>

<script>
import FileUpload from '../FileUpload.vue';

export default {
  name: 'file',
  props: {
    meta: { type: Object, default: () => ({ value: null }) }
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

  .file-name {
    color:#0000FF;
    font-size: 16px;
    text-decoration: underline;
    cursor: pointer;
  }
}
</style>
