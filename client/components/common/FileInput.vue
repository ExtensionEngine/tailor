<template>
  <upload-provider
    v-slot="{ uploading, uploadFile, downloadFile, deleteFile }"
    @upload="$emit('upload', $event)"
    @uploading="$emit('update:uploading', $event)"
    @delete="$emit('delete', $event)"
    :folder="folder">
    <form @submit.prevent>
      <v-file-input
        v-if="!fileKey"
        :ref="id"
        @change.native="uploadFile"
        @click:append="$refs[id].$el.querySelector('input').click()"
        :accept="acceptedFileTypes"
        :label="label"
        :placeholder="placeholder"
        :outlined="outlined"
        :dense="dense"
        :clearable="false"
        :append-icon="uploading ? 'mdi-loading mdi-spin' : 'mdi-upload'"
        prepend-icon="" />
      <div v-else class="mb-5 px-1 grey--text text--darken-3">
        <div>{{ label }}</div>
        <v-btn
          @click="downloadFile(fileKey, fileName)"
          text
          class="grey--text text--darken-4 text-none px-0">
          {{ fileName | truncate(35) }}
        </v-btn>
        <v-btn
          @click="deleteFile({ id, fileName })"
          color="grey darken-4"
          icon x-small
          class="ml-1">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </div>
    </form>
  </upload-provider>
</template>

<script>
import get from 'lodash/get';
import uniqueId from 'lodash/uniqueId';
import UploadProvider from '@/components/common/mixins/UploadProvider';

export default {
  name: 'file-input',
  props: {
    id: { type: String, default: () => uniqueId('file_') },
    fileKey: { type: String, default: '' },
    fileName: { type: String, default: '' },
    folder: { type: String, default: null },
    validate: { type: Object, default: () => ({ ext: [] }) },
    label: { type: String, default: 'File upload' },
    placeholder: { type: String, default: 'Choose a file' },
    outlined: { type: Boolean, default: false },
    dense: { type: Boolean, default: false }
  },
  computed: {
    acceptedFileTypes() {
      const ext = get(this.validate, 'ext', []);
      return ext.length ? `.${ext.join(',.')}` : '';
    }
  },
  components: { UploadProvider }
};
</script>
