<template>
  <component
    v-bind="$attrs"
    :is="tag"
    :tag="type"
    :for="null"
    class="resource-upload">
    <input
      ref="input"
      :accept="fileFilter"
      v-on="$listeners"
      @change="onFileSelected"
      type="file">
    <slot>Choose a file</slot>
  </component>
</template>

<script>
export default {
  name: 'resource-upload',
  inject: ['$validator'],
  $_veeValidate: {
    value() {
      return Array.from(this.$refs.input.files);
    }
  },
  props: {
    action: { type: String, required: true },
    upload: { type: Function, required: true },
    preflight: { type: Function, required: true },
    accept: { type: [String, Array], default: null },
    tag: { type: String, default: () => 'label' },
    params: { type: Object, default: () => ({}) }
  },
  data: () => ({ uploading: false }),
  computed: {
    auth: ({ $options }) => $options.$_auth(),
    type: ({ tag }) => tag !== 'label' ? 'label' : null,
    fileFilter: ({ accept }) => Array.isArray(accept) ? accept.join(',') : accept
  },
  methods: {
    onFileSelected(e) {
      if (!e.target.files) return;
      const [file] = e.target.files;
      if (!this.$validator) return this.uploadFile(file);
      return this.$validator.validate(this.$attrs.name)
        .then(isValid => isValid && this.uploadFile(file));
    },
    uploadFile(file) {
      this.uploading = true;
      return Promise.resolve(this.preflight())
        .then(config => {
          Object.assign(config, { params: this.params });
          if (!config.isPublic) config.params.auth = this.auth;
          return this.upload(file, config);
        })
        .finally(() => (this.uploading = false))
        .then(data => this.$emit('upload', data))
        .catch(err => this.$emit('error', err));
    }
  },
  watch: {
    uploading(val) {
      this.$emit('update:uploading', val);
    }
  }
};
</script>

<style lang="scss" scoped>
.resource-upload {
  position: relative;
  cursor: pointer;

  input {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    outline: none;
    pointer-events: none;
  }
}
</style>
