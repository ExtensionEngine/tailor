<template>
  <div class="file-upload">
    <circular-progress v-if="uploading"/>
    <form v-else ref="form" @submit.prevent class="upload-form">
      <input
        v-validate="validate"
        v-bind="{ id, name: id }"
        @change="upload"
        type="file"
        class="upload-input">
      <label
        v-if="!fileKey"
        :for="id"
        :class="[sm ? 'v-btn v-btn--small' : 'btn btn-material btn-sm upload-button']">
        {{ label }}
      </label>
      <template v-else>
        <asset-link
          :href="`storage://${fileKey}`"
          :download="fileName"
          class="file-name">
          {{ fileName }}
        </asset-link>
        <span @click="deleteFile" class="mdi mdi-delete delete"></span>
      </template>
    </form>
    <span class="help-block">{{ vErrors.first(id) }}</span>
  </div>
</template>

<script>
import CircularProgress from 'components/common/CircularProgress';
import EventBus from 'EventBus';
import uniqueId from 'lodash/uniqueId';
import { withValidation } from 'utils/validation';

const appChannel = EventBus.channel('app');

export default {
  name: 'file-upload',
  inject: ['$storageService'],
  mixins: [withValidation()],
  props: {
    id: { type: String, default: () => uniqueId('file_') },
    fileName: { type: String, default: '' },
    fileKey: { type: String, default: '' },
    validate: { type: Object, default: () => ({ rules: { ext: [] } }) },
    label: { type: String, default: 'Choose a file' },
    sm: { type: Boolean, default: false }
  },
  data: () => ({ uploading: false }),
  methods: {
    upload(e) {
      if (!e.target.files) return;
      const [file] = e.target.files;
      const data = new FormData();
      data.append('file', file, file.name);
      this.$validator.validateAll().then(isValid => {
        if (!isValid) return;
        this.uploading = true;
        return this.$storageService.upload(data)
          .then(({ url, publicUrl, key }) => {
            const { name } = data.get('file');
            this.$emit('upload', { url, publicUrl, key, name });
          })
          .catch(() => (this.error = 'An error has occurred!'))
          .finally(() => (this.uploading = false));
      });
    },
    deleteFile() {
      appChannel.emit('showConfirmationModal', {
        type: 'file',
        item: { name: this.fileName },
        action: () => this.$emit('delete', this.id, null)
      });
    }
  },
  watch: {
    uploading(val) {
      this.$emit('update:uploading', val);
    }
  },
  components: { CircularProgress }
};
</script>

<style lang="scss" scoped>
.file-upload, .upload-form {
  display: inline-block;
}

// Using width/height restriction on hidden element
// rather than `display: none;` because of Safari (v11.1 & v11.2) issue
// https://forums.developer.apple.com/thread/103471
.upload-input {
  visibility: hidden;
  max-width: 0;
  max-height: 0;
}

.upload-button {
  background-color: #eee;
}

.file-name {
  color: #00f;
  font-size: 16px;
  text-decoration: underline;
  cursor: pointer;
}

.delete {
  padding: 0 5px;
  color: #808080;
  font-size: 18px;
  cursor: pointer;

  &:hover {
    color: #555;
  }
}
</style>
