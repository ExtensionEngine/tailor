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
      v-if="!uploading && (urlInput || !hasAsset)"
      ref="provider"
      v-slot="{ errors }"
      :rules="{
        url: {
          protocols: ['http', 'https'],
          require_protocol: true,
          require_valid_protocol: true
        }
      }"
      name="URL">
      <v-text-field
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
    <template v-else>
      <v-btn
        v-if="hasChanges"
        @click.stop="save"
        :disabled="uploading"
        text
        class="action">
        Save
      </v-btn>
      <v-btn
        v-if="hasChanges || url"
        @click.stop="cancel"
        :disabled="uploading"
        text
        class="action">
        Cancel
      </v-btn>
    </template>
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
    hasChanges: vm => vm.url !== (vm.isLinked ? vm.urlInput : get(vm, 'file.url', null)),
    fileName() {
      if (!this.file) return null;
      return last(this.file.url.split('___'));
    }
  },
  methods: {
    async save() {
      if (this.$refs.provider) {
        const { valid } = await this.$refs.provider.validate();
        if (!valid) return;
      }
      this.isEditing = false;
      const payload = this.file || { url: this.urlInput, publicUrl: this.urlInput };
      this.$emit('input', payload);
    },
    cancel() {
      const isLinked = !isUploaded(this.url);
      this.urlInput = isLinked ? this.url : null;
      this.file = isLinked ? null : pick(this, ['url', 'publicUrl']);
      this.isEditing = !this.url;
    }
  },
  components: { UploadBtn }
};
</script>

<style lang="scss" scoped>
.v-text-field {
  min-width: 21.875rem;
  margin: 0.5rem 0.75rem 0 1.75rem;
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
