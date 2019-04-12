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
    direct: { type: Boolean, default: false },
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
      return this.getUploadUrl()
        .then(({ url, isPublic }) => {
          const params = Object.assign({}, this.params);
          if (!isPublic) params.auth = this.auth;
          return upload(url, file, params);
        })
        .finally(() => (this.uploading = false))
        .then(data => this.$emit('upload', data))
        .catch(err => this.$emit('error', err));
    },
    getUploadUrl() {
      if (this.direct) return Promise.resolve({ url: this.action, isPublic: false });
      // TODO: Resolve public upload url!
    }
  },
  watch: {
    uploading(val) {
      this.$emit('update:uploading', val);
    }
  }
};

function upload(url, file, params) {
  const body = new FormData();
  body.append('file', file, file.name);
  forEach(params, (value, name) => body.append(name, value));
  return fetch(url, { method: 'post', body }).then(resp => resp.json());
}

function forEach(obj, cb) {
  return Object.keys(obj).forEach(key => cb(obj[key], key));
}
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
