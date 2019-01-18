<template>
  <div>
    <form @submit.prevent="upload">
      <input
        v-validate="meta.validate"
        ref="fileInput"
        @change="onFileSelected"
        name="file"
        type="file">
      <input type="submit" value="Upload">
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
      uploading: false
    };
  },
  methods: {
    onFileSelected(e) {
      this.form = new FormData();
      const [file] = e.target.files;
      if (!file) {
        this.filename = null;
        return;
      }
      this.filename = file.name;
      this.form.append('file', file, file.name);
    },
    upload(e) {
      this.$validator.validate(this.meta.key).then(result => {
        if (!result) return;
        this.uploading = true;
        request.post('/files', this.form).then(res => {
          return res;
        });
      });
    }
  }
};
</script>

<style lang="scss" scoped>

</style>
