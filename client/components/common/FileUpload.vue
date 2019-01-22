<template>
  <div>
    <circular-progress v-if="uploading"></circular-progress>
    <form v-else @submit.prevent>
      <input
        v-validate="meta.validate"
        ref="fileInput"
        @change="upload"
        id="file-input"
        name="file"
        type="file"
        class="upload-input">
      <label
        v-if="!meta.value"
        for="file-input"
        class="btn btn-link btn-sm upload-button">
        Choose a file
      </label>
      <span
        v-else
        @click="consumeDownloadUrl"
        class="file-name">{{ savedfileName }}
      </span>
      <span v-if="meta.value" @click="deleteFile" class="mdi mdi-delete delete"></span>
    </form>
    <span class="help-block">{{ vErrors.first(meta.key) }}</span>
  </div>
</template>

<script>
import CircularProgress from 'components/common/CircularProgress';
import EventBus from 'EventBus';
import get from 'lodash/get';
import { withValidation } from 'utils/validation';
import request from '../../api/request';

const appChannel = EventBus.channel('app');

export default {
  name: 'file-upload',
  mixins: [withValidation()],
  props: {
    meta: { type: Object, default: () => ({}) }
  },
  data() {
    return {
      downloadUrl: '',
      extractedFileName: '',
      error: {},
      uploading: false
    };
  },
  computed: {
    savedfileName() {
      return get(this.meta, 'value.name', '');
    }
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
      this.$validator.validate(this.meta.key).then(result => {
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
      return request.get('/files', { params: { url: this.meta.value.url } })
        .then(({ data }) => {
          this.downloadUrl = data;
          return window.open(data, '_blank');
        });
    },
    deleteFile() {
      appChannel.emit('showConfirmationModal', {
        type: 'file',
        item: { name: this.savedfileName },
        action: () => {
          this.downloadUrl = '';
          return this.$emit('delete', this.meta.key, null);
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
