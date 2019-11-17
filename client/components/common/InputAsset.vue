<template>
  <div class="input-asset">
    <v-btn
      v-if="url && !isEditing"
      :href="publicUrl || url"
      target="_blank"
      text
      small
      icon
      color="info">
      <v-icon>mdi-open-in-new</v-icon>
    </v-btn>
    <file-upload
      v-if="allowFileUpload"
      v-show="!file && isEditing"
      @upload="val => (file = val) && (urlInput = null)"
      :uploading.sync="uploading"
      :validate="{ ext: extensions }"
      :confirm-deletion="false"
      :label="uploadLabel"
      sm />
    <template v-if="file">
      <v-btn
        v-if="isEditing"
        @click.stop="file = null"
        text
        small
        icon
        color="red">
        <v-icon>mdi-delete</v-icon>
      </v-btn>
      <v-text-field :value="fileName" disabled />
    </template>
    <v-text-field
      v-if="!uploading && (urlInput || !hasAsset)"
      v-model="urlInput"
      :disabled="!isEditing"
      :placeholder="allowFileUpload ? 'or paste a URL' : 'Paste a URL'" />
    <span class="actions">
      <v-btn
        v-if="!isEditing"
        @click.stop="isEditing = true"
        small>
        Edit
      </v-btn>
      <v-btn
        v-else
        @click.stop="save"
        :disabled="uploading || !hasAsset"
        text
        small
        class="my-1">
        {{ hasChanges ? 'Save' : 'Cancel' }}
      </v-btn>
    </span>
  </div>
</template>

<script>
import FileUpload from '@/components/common/FileUpload';
import get from 'lodash/get';
import last from 'lodash/last';
import pick from 'lodash/pick';

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
    hasAsset() {
      return this.file || this.urlInput;
    },
    isLinked() {
      return !!this.urlInput;
    },
    hasChanges() {
      return this.url !== (this.isLinked ? this.urlInput : get(this, 'file.url'));
    },
    fileName() {
      if (!this.file) return null;
      return last(this.file.url.split('___'));
    }
  },
  methods: {
    save() {
      this.isEditing = false;
      const payload = this.file || { url: this.urlInput, publicUrl: this.urlInput };
      this.$emit('input', payload);
    }
  },
  components: { FileUpload }
};
</script>

<style lang="scss" scoped>
.input-asset {
  display: flex;
  justify-content: center;
}

.v-text-field {
  max-width: 600px;
  margin: 0 20px;
  margin-top: 2px;
  padding: 0 7px;
  padding-bottom: 0;
}

::v-deep .help-block {
  display: none;
}

::v-deep .circular-progress {
  width: 20px;
  margin: 0 30px;
}
</style>
