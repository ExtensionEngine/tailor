<template>
  <div>
    <form @submit.prevent>
      <input
        v-validate="meta.validate"
        ref="fileInput"
        @change="upload"
        id="file-input"
        name="file"
        type="file"
        class="upload-input">
      <label
        v-if="!meta.value"
        for="file-input"
        class="btn btn-link btn-sm upload-button">
        Choose a file
      </label>
    </form>
    <span class="help-block">{{ vErrors.first(meta.key) }}</span>
  </div>
</template>

<script>
import { withValidation } from 'utils/validation';

import request from '../../api/request';

export default {
  name: 'file-upload',
  mixins: [withValidation()],
  props: {
    meta: { type: Object, default: () => ({}) }
  },
  data() {
    return {
      fileName: '',
      uploading: false,
      error: {}
    };
  },
  methods: {
    constructFileForm(e) {
      this.form = new FormData();
      const [file] = e.target.files;
      if (!file) {
        this.filename = null;
        return;
      }
      this.fileName = file.name;
      this.form.append('file', file, file.name);
    },
    upload(e) {
      this.constructFileForm(e);
      this.$validator.validate(this.meta.key).then(result => {
        if (!result) return;
        this.uploading = true;
        return request.post('/files', this.form).then(({ data }) => {
          this.uploading = false;
          if (!data.error) return this.$emit('key', data.key, this.fileName);
          this.error = data.error;
        });
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.upload-input {
  visibility: hidden;
}

.upload-button {
  padding: 0;
}

</style>
