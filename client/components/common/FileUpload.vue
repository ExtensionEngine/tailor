<template>
  <form @submit.prevent class="upload-form">
    <v-file-input
      v-if="!fileKey"
      @change.native="upload"
      :loading="uploading"
      :label="label"
      :accept="acceptedFileTypes"
      dense />
    <template v-else>
      <v-btn @click="downloadFile" text class="text-none" color="primary">
        {{ fileName | truncate(35) }}
      </v-btn>
      <v-btn @click="deleteFile" icon class="ml-2">
        <v-icon color="primary lighten-1" size="22">mdi-delete</v-icon>
      </v-btn>
    </template>
  </form>
</template>

<script>
import downloadMixin from 'utils/downloadMixin';
import EventBus from 'EventBus';
import uniqueId from 'lodash/uniqueId';

const appChannel = EventBus.channel('app');

export default {
  name: 'file-upload',
  inject: ['$storageService'],
  mixins: [downloadMixin],
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
  computed: {
    acceptedFileTypes() {
      const { ext } = this.validate;
      return ext.length ? `.${ext.join(',.')}` : '';
    }
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
      this.uploading = true;
      return this.$storageService.upload(this.form)
        .then(({ url, publicUrl, key }) => {
          this.uploading = false;
          const { name } = this.form.get('file');
          this.$emit('upload', { url, publicUrl, key, name });
        }).catch(() => {
          this.error = 'An error has occurred!';
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
  }
};
</script>

<style lang="scss" scoped>
.upload-form {
  display: inline-block;
  min-width: 100%;
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
</style>
