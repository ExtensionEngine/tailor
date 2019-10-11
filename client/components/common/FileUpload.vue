<template>
  <div class="file-upload">
    <circular-progress v-if="uploading" />
    <form v-else @submit.prevent class="upload-form">
      <input
        :ref="id"
        v-filefilter="'auto'"
        v-validate="validate"
        @change="upload"
        :id="id"
        :name="id"
        type="file"
        class="upload-input">
      <label
        v-if="!fileKey"
        :for="id"
        :class="[sm ? 'v-btn v-btn--small' : 'btn btn-material btn-sm upload-button']">
        {{ label }}
      </label>
      <span
        v-else
        @click="downloadFile"
        class="file-name">{{ fileName }}
      </span>
      <span v-if="fileKey" @click="deleteFile" class="mdi mdi-delete delete"></span>
    </form>
    <span class="help-block">{{ vErrors.first(id) }}</span>
  </div>
</template>

<script>
import CircularProgress from 'components/common/CircularProgress';
import downloadMixin from 'utils/downloadMixin';
import EventBus from 'EventBus';
import uniqueId from 'lodash/uniqueId';
import { withValidation } from 'utils/validation';

const appChannel = EventBus.channel('app');

export default {
  name: 'file-upload',
  inject: ['$storageService'],
  mixins: [downloadMixin, withValidation()],
  props: {
    id: { type: String, default: () => uniqueId('file_') },
    fileName: { type: String, default: '' },
    fileKey: { type: String, default: '' },
    validate: { type: Object, default: () => ({ ext: [] }) },
    label: { type: String, default: 'Choose a file' },
    sm: { type: Boolean, default: false }
  },
  data() {
    return { uploading: false };
  },
  methods: {
    createFileForm(e) {
      this.form = new FormData();
      const [file] = e.target.files;
      if (!file) return;
      this.form.append('file', file, file.name);
    },
    upload(e) {
      this.createFileForm(e);
      this.$validator.validate(this.id).then(isValid => {
        if (!isValid) return;
        this.uploading = true;
        return this.$storageService.upload(this.form)
          .then(({ url, publicUrl, key }) => {
            this.uploading = false;
            const { name } = this.form.get('file');
            this.$emit('upload', { url, publicUrl, key, name });
          }).catch(() => {
            this.error = 'An error has occurred!';
          });
      });
    },
    downloadFile() {
      return this.$storageService.getUrl(this.fileKey)
        .then(url => this.download(url, this.fileName));
    },
    deleteFile() {
      appChannel.emit('showConfirmationModal', {
        title: 'Delete file?',
        message: `Are you sure you want to delete ${this.fileName}?`,
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
