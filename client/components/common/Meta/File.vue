<template>
  <div class="meta-file-upload">
    <label :for="meta.key" class="meta-name">{{ meta.label }}</label>
    <file-upload :meta="meta" @key="updateActivity"></file-upload>
    <span>{{ meta.value.name }}</span>
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
    updateActivity(key, name) {
      return this.$emit('update', key, name);
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
