<template>
  <div>
    <form @submit.prevent="upload">
      <input
        ref="fileInput"
        @change="onFileSelected"
        name="file"
        type="file">
      <input type="submit" value="Upload">
    </form>
  </div>
</template>

<script>
import request from '../../api/request';

export default {
  name: 'file-upload',
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
      this.uploading = true;
      request.post('/files', this.form).then(res => {
        return res;
      });
    }
  }
};
</script>

<style lang="scss" scoped>

</style>
