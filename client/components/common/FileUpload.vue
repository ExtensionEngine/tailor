<template>
  <div>
    <circular-progress v-if="uploading"/>
    <form v-else @submit.prevent>
      <input
        v-validate="validate"
        :id="id"
        :ref="id"
        :name="id"
        @change="upload"
        type="file"
        class="upload-input">
      <label
        v-if="!fileKey"
        :for="id"
        class="btn btn-material btn-sm upload-button">
        {{ label }}
      </label>
      <span
        v-else
        @click="download"
        class="file-name">{{ fileName }}
      </span>
      <span v-if="fileKey" @click="deleteFile" class="mdi mdi-delete delete"></span>
    </form>
    <span class="help-block">{{ vErrors.first(id) }}</span>
  </div>
</template>

<script>
import api from '@/api/asset';
import CircularProgress from 'components/common/CircularProgress';
import EventBus from 'EventBus';
import uniqueId from 'lodash/uniqueId';
import { withValidation } from 'utils/validation';

const appChannel = EventBus.channel('app');

export default {
  name: 'file-upload',
  mixins: [withValidation()],
  props: {
    id: { type: String, default: () => uniqueId('file_') },
    fileName: { type: String, default: '' },
    fileKey: { type: String, default: '' },
    validate: { type: Object, default: () => ({ rules: { ext: [] } }) },
    label: { type: String, default: 'Choose a file' }
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
        return api.upload(this.form)
          .then(({ key }) => {
            this.uploading = false;
            this.$emit('upload', { key, name: this.form.get('file').name });
          }).catch(() => {
            this.error = 'An error has occurred!';
          });
      });
    },
    download() {
      return api.getUrl(this.fileKey).then(url => {
        const a = document.createElement('a');
        a.href = url;
        a.download = this.fileName;
        a.target = '_blank';
        a.click();
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
  components: { CircularProgress }
};
</script>

<style lang="scss" scoped>
.upload-input {
  visibility: hidden;
}

.upload-button {
  background-color: #eee;
}

.file-name {
  color:#0000FF;
  font-size: 16px;
  text-decoration: underline;
  cursor: pointer;
}

.delete {
  padding: 0 5px;
  font-size: 18px;
  color: #808080;
  cursor: pointer;

  &:hover {
    color: #555;
  }
}
</style>
