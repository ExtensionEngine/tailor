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
        :class="[sm ? 'v-btn v-size--small my-1' : 'btn btn-material btn-sm upload-button']">
        {{ label }}
      </label>
      <span
        v-else
        @click="downloadFile(fileKey, fileName)"
        class="file-name">{{ fileName }}
      </span>
      <span
        v-if="fileKey"
        @click="deleteFile({ id, fileName })"
        class="mdi mdi-delete delete">
      </span>
    </form>
    <span class="help-block">{{ vErrors.first(id) }}</span>
  </div>
</template>

<script>
import CircularProgress from 'components/common/CircularProgress';
import uniqueId from 'lodash/uniqueId';
import uploadMixin from '@/components/common/mixins/upload';
import { withValidation } from 'utils/validation';

export default {
  name: 'upload-btn',
  inject: ['$storageService'],
  mixins: [uploadMixin, withValidation()],
  props: {
    id: { type: String, default: () => uniqueId('file_') },
    fileName: { type: String, default: '' },
    fileKey: { type: String, default: '' },
    validate: { type: Object, default: () => ({ ext: [] }) },
    label: { type: String, default: 'Choose a file' },
    sm: { type: Boolean, default: false }
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
