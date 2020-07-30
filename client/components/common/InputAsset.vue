<template>
  <v-toolbar-items>
    <v-btn
      v-if="url && !isEditing"
      :href="publicUrl || url"
      target="_blank"
      color="info"
      text>
      <v-icon>mdi-open-in-new</v-icon>
    </v-btn>
    <upload-btn
      v-if="allowFileUpload"
      v-show="!file && isEditing"
      @upload="val => (file = val) && (urlInput = null)"
      :uploading.sync="uploading"
      :validate="{ ext: extensions }"
      :confirm-deletion="false"
      :label="uploadLabel"
      class="upload-btn" />
    <template v-if="file">
      <v-btn
        v-if="isEditing"
        @click.stop="file = null"
        color="red"
        text>
        <v-icon>mdi-delete</v-icon>
      </v-btn>
      <v-text-field
        :value="fileName"
        readonly hide-details filled />
    </template>
    <validation-provider
      ref="provider"
      v-slot="{ errors }"
      :rules="{ ext_url: { extensions } }"
      name="URL">
      <v-text-field
        v-if="!uploading && (urlInput || !hasAsset)"
        v-model="urlInput"
        :error-messages="errors"
        :disabled="!isEditing"
        :placeholder="allowFileUpload ? 'or paste a URL...' : 'Paste a URL...'"
        filled clearable />
    </validation-provider>
    <v-btn
      v-if="!isEditing"
      @click.stop="isEditing = true"
      text
      class="action">
      Edit
    </v-btn>
    <v-btn
      v-else
      @click.stop="save"
      :disabled="uploading || !hasAsset"
      text
      class="action">
      {{ hasChanges ? 'Save' : 'Cancel' }}
    </v-btn>
  </v-toolbar-items>
</template>

<script>
import get from 'lodash/get';
import last from 'lodash/last';
import pick from 'lodash/pick';
import UploadBtn from 'tce-core/UploadBtn';

function isUploaded(url) {
  try {
    return url && new URL(url).protocol === 'storage:';
  } catch (e) {
    return false;
  }
}

export default {
  name: 'input-asset',
  props: {
    url: { type: String, default: null },
    publicUrl: { type: String, default: null },
    extensions: { type: Array, required: true },
    allowFileUpload: { type: Boolean, default: true },
    uploadLabel: { type: String, default: 'Select file' }
  },
  data() {
    const isLinked = !isUploaded(this.url);
    return {
      isEditing: !this.url,
      uploading: false,
      file: isLinked ? null : pick(this, ['url', 'publicUrl']),
      urlInput: isLinked ? this.url : null
    };
  },
  computed: {
    hasAsset: vm => vm.file || vm.urlInput,
    isLinked: vm => !!vm.urlInput,
    hasChanges: vm => vm.url !== (vm.isLinked ? vm.urlInput : get(vm, 'file.url')),
    fileName() {
      if (!this.file) return null;
      return last(this.file.url.split('___'));
    }
  },
  methods: {
    async save() {
      const { valid } = await this.$refs.provider.validate();
      if (!valid) return;
      this.isEditing = false;
      const payload = this.file || { url: this.urlInput, publicUrl: this.urlInput };
      this.$emit('input', payload);
    }
  },
  components: { UploadBtn }
};
</script>

<style lang="scss" scoped>
.v-text-field {
  min-width: 21.875rem;
  margin: 0.75rem 0.75rem 0 1.75rem;

  ::v-deep .v-input__slot {
    min-height: 2.75rem;
    margin-bottom: 0.1875rem;

    .v-input__append-inner {
      margin-top: 0.75rem;
    }
  }
}

.action ::v-deep .v-btn__content {
  min-width: 4rem !important;
}

.upload-btn ::v-deep .v-btn {
  height: 100%;

  .v-btn__content {
    padding: 1.5rem 0;
  }
}
</style>
