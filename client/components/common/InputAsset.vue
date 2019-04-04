<template>
  <div class="input-asset">
    <template v-if="!isEditing">
      <v-btn flat icon color="info">
        <component
          :is="isFile ? 'asset-link' : 'a'"
          :href="url"
          target="_blank">
          <v-icon>mdi-open-in-new</v-icon>
        </component>
      </v-btn>
      <v-text-field
        :value="isFile ? filename(asset.url) : asset.url"
        :hide-details="true"
        disabled/>
    </template>
    <template v-else>
      <file-upload
        v-if="!isFile"
        :label="uploadLabel"
        :uploading.sync="uploading"
        :validate="{ ext: extensions }"
        @upload="onFileUpload"
        sm/>
      <v-btn
        v-else
        @click.stop="onFileDelete"
        flat
        icon
        color="red">
        <v-icon>mdi-delete</v-icon>
      </v-btn>
      <v-text-field
        v-show="!uploading"
        :disabled="isFile"
        :value="isFile ? filename(asset.url) : asset.url"
        :hide-details="true"
        @input="onLinkSet"
        placeholder="or paste a URL"/>
    </template>
    <div class="actions">
      <v-btn v-if="!isEditing" @click.stop="isEditing = true" small>
        Edit
      </v-btn>
      <v-btn v-else :disabled="uploading || !asset.url" @click.stop="submit" small>
        {{ hasChanges ? 'Save' : 'Cancel' }}
      </v-btn>
    </div>
  </div>
</template>

<script>
import { basename } from 'path';
import FileUpload from '@/components/common/FileUpload';

const FILENAME_DELIMITER = /_+/g;

const castString = arg => arg || '';
const last = arr => arr[arr.length - 1];

export default {
  name: 'input-asset',
  props: {
    url: { type: String, default: null },
    publicUrl: { type: String, default: null },
    extensions: { type: Array, required: true },
    uploadLabel: { type: String, default: 'Select file' }
  },
  data() {
    const url = castString(this.url);
    const publicUrl = castString(this.publicUrl);
    return {
      isEditing: !url,
      isFile: Boolean(url) && !isLinked(url),
      uploading: false,
      asset: { url, publicUrl }
    };
  },
  computed: {
    hasChanges: ({ url, asset }) => castString(url) !== castString(asset.url)
  },
  methods: {
    filename(url) {
      const { pathname } = parseUrl(url) || {};
      return last(basename(pathname).split(FILENAME_DELIMITER));
    },
    onFileUpload({ url, publicUrl }) {
      this.isFile = true;
      Object.assign(this.asset, { url, publicUrl });
    },
    onFileDelete() {
      // TODO: Remove asset from server.
      this.isFile = false;
      Object.assign(this.asset, { url: '', publicUrl: '' });
    },
    onLinkSet(url) {
      this.isFile = false;
      Object.assign(this.asset, { url, publicUrl: url });
    },
    submit() {
      this.isEditing = false;
      if (!this.hasChanges) return;
      this.$emit('input', { ...this.asset });
    }
  },
  components: { FileUpload }
};

function isLinked(url) {
  const { protocol } = parseUrl(url) || {};
  return protocol === 'https:' || protocol === 'http:';
}

function parseUrl(url) {
  try {
    return url && new URL(url);
  } catch (e) {}
}
</script>

<style lang="scss" scoped>
.input-asset {
  display: flex;
  justify-content: center;
  align-items: center;
}

.v-text-field {
  max-width: 600px;
  margin: 0 8px 6px;
  padding: 0 8px;
}

/deep/ .help-block {
  display: none;
}

/deep/ .circular-progress {
  width: 20px;
  margin: 0 30px;
}
</style>
