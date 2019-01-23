<template>
  <div>
    <circular-progress v-if="uploading"></circular-progress>
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
        v-if="!fileUrl"
        :for="id"
        class="btn btn-link btn-sm upload-button">
        {{ labelText }}
      </label>
      <span
        v-else
        @click="consumeDownloadUrl"
        class="file-name">{{ fileName }}
      </span>
      <span v-if="fileUrl" @click="deleteFile" class="mdi mdi-delete delete"></span>
    </form>
    <span class="help-block">{{ vErrors.first(id) }}</span>
  </div>
</template>

<script>
import CircularProgress from 'components/common/CircularProgress';
import EventBus from 'EventBus';
import request from '../../api/request';
import uniqueId from 'lodash/uniqueId';
import { withValidation } from 'utils/validation';

const appChannel = EventBus.channel('app');

export default {
  name: 'file-upload',
  mixins: [withValidation()],
  props: {
    id: { type: String, default: () => uniqueId('file_') },
    fileName: { type: String, default: '' },
    fileUrl: { type: String, default: '' },
    validate: { type: Object, default: () => ({ rules: { ext: [] } }) },
    labelText: { type: String, default: 'Choose a file' }
  },
  data() {
    return {
      downloadUrl: '',
      extractedFileName: '',
      error: {},
      uploading: false
    };
  },
  methods: {
    constructFileForm(e) {
      this.form = new FormData();
      const [file] = e.target.files;
      if (!file) {
        this.extractedFileName = null;
        return;
      }
      this.extractedFileName = file.name;
      this.form.append('file', file, file.name);
    },
    upload(e) {
      this.constructFileForm(e);
      this.$validator.validate(this.id).then(result => {
        if (!result) return;
        this.uploading = true;
        return request.post('/files', this.form).then(({ data }) => {
          this.uploading = false;
          if (!data.error) return this.$emit('key', data.key, this.extractedFileName);
          this.error = data.error;
        });
      });
    },
    consumeDownloadUrl() {
      return request.get('/files', { params: { url: this.fileUrl } })
        .then(({ data }) => {
          const a = document.createElement('a');
          a.href = data;
          a.target = '_blank';
          a.click();
        });
    },
    deleteFile() {
      appChannel.emit('showConfirmationModal', {
        type: 'file',
        item: { name: this.fileName },
        action: () => {
          this.downloadUrl = '';
          return this.$emit('delete', this.id, null);
        }
      });
    }
  },
  components: {
    CircularProgress
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

  &:hover {
    color: #555;
  }
}

</style>
