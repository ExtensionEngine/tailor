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
    <v-text-field
      v-if="url"
      v-model.trim="label"
      placeholder="Label" />
  </div>
</template>

<script>
import debounce from 'lodash/debounce';
import get from 'lodash/get';

export default {
  name: 'tce-file-toolbar',
  inject: ['$elementBus'],
  props: {
    element: { type: Object, required: true }
  },
  computed: {
    url() {
      return get(this.element, 'data.url');
    },
    label: {
      get() {
        return get(this.element, 'data.label');
      },
      set: debounce(function (value) {
        this.$elementBus.emit('update:label', value);
      }, 1000)
    }
  },
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

  .v-text-field {
    max-width: 500px;
    margin: 5px 20px 0;
  }
}
</style>
