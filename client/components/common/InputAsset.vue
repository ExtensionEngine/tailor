<template>
  <div class="input-asset">
    <v-btn
      v-if="url && !isEditing"
      :href="publicUrl || url"
      target="_blank"
      flat
      small
      icon
      color="info">
      <v-icon>mdi-open-in-new</v-icon>
    </v-btn>
    <file-upload
      v-show="!file && isEditing"
      :uploading.sync="uploading"
      :validate="{ ext: 'PDF' }"
      @upload="val => (file = val) && (urlInput = null)"
      sm/>
    <template v-if="file">
      <v-btn
        v-if="isEditing"
        @click.stop="removeAsset"
        flat
        small
        icon
        color="red">
        <v-icon>mdi-delete</v-icon>
      </v-btn>
      <v-text-field :value="fileName" disabled/>
    </template>
    <v-text-field
      v-if="!uploading && (urlInput || !hasAsset)"
      v-model="urlInput"
      :disabled="!isEditing"
      placeholder="or paste a URL"/>
    <span class="actions">
      <v-btn
        v-if="!isEditing"
        @click.stop="isEditing = true"
        small>
        Edit
      </v-btn>
      <v-btn
        v-else
        :disabled="uploading || !hasAsset"
        @click.stop="save"
        small>
        {{ hasChanges ? 'Save' : 'Cancel' }}
      </v-btn>
    </span>
  </div>
</template>

<script>
import EventBus from 'EventBus';
import FileUpload from '@/components/common/FileUpload';
import get from 'lodash/get';
import last from 'lodash/last';
import pick from 'lodash/pick';

const appChannel = EventBus.channel('app');
const isUploaded = url => url && new URL(url).protocol === 'storage:';

export default {
  name: 'input-asset',
  props: {
    url: { type: String, default: null },
    publicUrl: { type: String, default: null }
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
    },
    removeAsset() {
      appChannel.emit('showConfirmationModal', {
        type: 'asset',
        item: { name: this.fileName },
        action: () => (this.file = null)
      });
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
  padding: 0 7px;
  margin-top: 2px;
  padding-bottom: 0;
}

/deep/ .help-block {
  display: none;
}

/deep/ .circular-progress {
  width: 20px;
  margin: 0 30px;
}
</style>
