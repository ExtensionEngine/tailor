<template>
  <div class="file-upload">
    <circular-progress v-if="uploading"/>
    <form v-else @submit.prevent class="upload-form">
      <component
        v-if="!fileKey"
        v-bind="$attrs"
        :for="id"
        :is="tag"
        :class="[isLabel ? 'btn btn-material btn-sm' : '', 'file']"
        :tag="!isLabel ? label : null">
        <input
          v-validate="validate"
          v-bind="{ id, name: id }"
          :accept="validate.ext.join(',')"
          @change="upload"
          type="file"
          class="upload-input">
        <slot>Choose a file</slot>
      </component>
      <template v-else>
        <asset-link
          :href="fileKey"
          :download="fileName"
          class="file-name">
          {{ fileName }}
        </asset-link>
        <span @click="deleteFile" class="mdi mdi-delete delete"></span>
      </template>
    </form>
    <span class="help-block">{{ vErrors.first(id) }}</span>
  </div>
</template>

<script>
import CircularProgress from 'components/common/CircularProgress';
import EventBus from 'EventBus';
import uniqueId from 'lodash/uniqueId';
import { withValidation } from 'utils/validation';

const appChannel = EventBus.channel('app');

export default {
  name: 'file-upload',
  inject: ['$storageService'],
  mixins: [withValidation()],
  inheritAttrs: false,
  props: {
    id: { type: String, default: () => uniqueId('file_') },
    fileName: { type: String, default: '' },
    fileKey: { type: String, default: '' },
    validate: { type: Object, default: () => ({ rules: { ext: [] } }) },
    tag: { type: String, default: () => 'label' }
  },
  data: () => ({ uploading: false }),
  computed: {
    isLabel: ({ tag }) => tag === 'label'
  },
  methods: {
    upload(e) {
      if (!e.target.files) return;
      const [file] = e.target.files;
      const data = new FormData();
      data.append('file', file, file.name);
      this.$validator.validateAll().then(isValid => {
        if (!isValid) return;
        this.uploading = true;
        return this.$storageService.upload(data)
          .finally(() => (this.uploading = false))
          .then(({ url, publicUrl, key }) => {
            this.$emit('upload', { url, publicUrl, key, name: file.name });
          })
          .catch(() => (this.error = 'An error has occurred!'));
      });
    },
    deleteFile() {
      appChannel.emit('showConfirmationModal', {
        type: 'file',
        item: { name: this.fileName },
        action: () => this.$emit('delete', this.id, null)
      });
    }
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
.file {
  position: relative;
  padding: 6px 8px;
  background: darken(#fff, 8%);
  cursor: pointer;

  &:hover, &.active {
    background: darken(#fff, 16%);
  }

  input {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    outline: none;
    pointer-events: none;
  }
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
