<template>
  <div class="file-upload">
    <div class="upload-button">
      <label for="upload" class="upload-label btn btn-link btn-sm">
        <span class="mdi mdi-file"></span> Upload
        <input @change="upload" id="upload" type="file" class="upload-input"/>
      </label>
    </div>
  </div>
</template>

<script>
import isEmpty from 'lodash/isEmpty';

export default {
  name: 'file-upload',
  methods: {
    upload({ target }) {
      const file = !isEmpty(target.files) ? target.files[0] : null;
      if (!file) return;
      const reader = new window.FileReader();
      reader.readAsDataURL(file);
      reader.addEventListener('load', e => {
        window.alert('uploaded');
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.upload-button {
  padding: 0;
}

.upload-label {
  height: 100%;
  margin: 0;
  padding: 0;
  cursor: pointer;
}

.upload-input {
  display: none;
}
</style>
