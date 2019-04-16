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
const isProduction = process.env.NODE_ENV === 'production';

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
      return Promise.resolve(this.getUploadConfig(file))
        .then(config => {
          config.fields = Object.assign({}, config.fields, this.params);
          if (!config.isPublic) config.fields.auth = this.auth;
          return this.upload(file, config);
        })
        .finally(() => (this.uploading = false))
        .then(data => this.$emit('upload', data))
        .catch(err => {
          this.$emit('error', err);
          if (!isProduction) throw err;
        });
    },
    getUploadConfig(file) {
      if (!this.direct) return preflight(this.action, { file, auth: this.auth });
      return Promise.resolve({
        url: this.action,
        isPublic: false,
        response: {
          type: 'json',
          keys: { key: 'key' }
        }
      });
    }
  },
  watch: {
    uploading(val) {
      this.$emit('update:uploading', val);
    }
  }
};

async function preflight(url, { file, auth }) {
  const form = new FormData();
  form.append('auth', auth);
  form.append('filename', file.name);
  form.append('filesize', file.size);
  form.append('filetype', file.type);
  const resp = await fetch(url, { method: 'OPTIONS', body: form });
  if (!resp.ok) throw new Error(`Fetch error: ${resp.statusText}`);
  return resp.json();
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
