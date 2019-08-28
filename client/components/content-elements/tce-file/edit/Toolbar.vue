<template>
  <div class="tce-file-toolbar">
    <form ref="upload" @submit.prevent>
      <label class="btn btn-sm btn-link upload-label">
        <input
          @change="uploadFile"
          class="upload-input"
          type="file"
          name="file">
        <v-icon>mdi mdi-file-upload</v-icon> Upload
      </label>
    </form>
  </div>
</template>

<script>
export default {
  name: 'tce-file-toolbar',
  inject: ['$elementBus'],
  methods: {
    uploadFile() {
      const form = this.$refs.upload;
      const formData = new FormData(form);
      this.$elementBus.emit('upload', formData);
    }
  }
};
</script>

<style lang="scss" scoped>
.tce-file-toolbar {
  display: flex;
  align-items: center;
  height: 45px;

  .upload-input {
    visibility: hidden;
    max-width: 0;
    max-height: 0;
  }

  .upload-label {
    display: flex;
    align-items: center;
    padding: 10px 20px;

    .mdi-file-upload {
      padding-right: 5px;
      font-size: 20px;
      line-height: 20px;
    }
  }
}
</style>
