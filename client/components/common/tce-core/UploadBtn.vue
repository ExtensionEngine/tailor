<template>
  <upload-provider
    v-slot="{ uploading, downloadFile, deleteFile }"
    ref="provider"
    @upload="$emit('upload', $event)"
    @uploading="$emit('update:uploading', $event)"
    @delete="$emit('delete', $event)"
    :folder="folder"
    class="file-upload">
    <form @submit.prevent class="upload-form">
      <validation-provider ref="validator" :rules="validate">
        <input
          :ref="id"
          @change="validateAndUpload"
          :id="id"
          :name="id"
          :accept="validate.ext"
          type="file"
          class="upload-input">
      </validation-provider>
      <v-btn
        v-if="!fileKey"
        @click="$refs[id].click()"
        :loading="uploading"
        color="grey darken-4"
        text>
        <v-icon color="secondary" class="mr-2">mdi-cloud-upload-outline</v-icon>
        {{ label }}
      </v-btn>
      <span
        v-else
        @click="downloadFile(fileKey, fileName)"
        class="file-name">{{ fileName }}
      </span>
      <v-btn
        v-if="fileKey"
        @click="deleteFile({ id, fileName })"
        icon small>
        <v-icon>mdi-delete</v-icon>
      </v-btn>
    </form>
  </upload-provider>
</template>

<script>
import uniqueId from 'lodash/uniqueId';
import UploadProvider from '@/components/common/UploadProvider';

export default {
  name: 'upload-btn',
  props: {
    id: { type: String, default: () => uniqueId('file_') },
    fileName: { type: String, default: '' },
    fileKey: { type: String, default: '' },
    folder: { type: String, default: null },
    validate: { type: Object, default: () => ({ ext: [] }) },
    label: { type: String, default: 'Choose a file' },
    sm: { type: Boolean, default: false }
  },
  methods: {
    async validateAndUpload(e) {
      const { valid } = await this.$refs.validator.validate(e);
      if (valid) this.$refs.provider.uploadFile(e);
    }
  },
  components: { UploadProvider }
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

.file-name {
  color: #00f;
  font-size: 1rem;
  text-decoration: underline;
  cursor: pointer;
}
</style>
