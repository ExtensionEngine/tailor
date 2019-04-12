<template>
  <div class="control">
    <label class="title">{{ meta.label }}</label>
    <template v-if="!value">
      <circular-progress v-if="uploading"/>
      <asset-upload
        v-validate="validate"
        v-if="!value"
        :name="name"
        :accept="fileFilter"
        @upload="$emit('update', meta.key, $event)"
        tag="label"
        class="upload-btn btn btn-material btn-sm">
        {{ meta.placeholder }}
      </asset-upload>
      <span class="help-block">{{ vErrors.first(name) }}</span>
    </template>
    <template v-else>
      <asset-link :href="url" :download="filename" class="file-link">
        {{ filename }}
      </asset-link>
      <span @click="onFileDelete" class="delete-btn mdi mdi-delete"></span>
    </template>
  </div>
</template>

<script>
import CircularProgress from '@/components/common/CircularProgress';
import EventBus from '@/EventBus';
import { withValidation } from '@/utils/validation';

const appChannel = EventBus.channel('app');

export default {
  name: 'file-input',
  mixins: [withValidation()],
  props: {
    meta: { type: Object, default: () => ({ value: null }) }
  },
  data: () => ({ uploading: false }),
  computed: {
    name: ({ meta }) => meta.key,
    value: ({ meta }) => meta.value,
    url: ({ value }) => value.url,
    filename: ({ value }) => value.filename,
    validate: ({ meta }) => meta.validate,
    fileFilter: ({ validate }) => validate ? readSpecifiers(validate) : []
  },
  methods: {
    onFileDelete() {
      appChannel.emit('showConfirmationModal', {
        type: 'file',
        item: { name: this.filename },
        action: () => this.deleteFile()
      });
    },
    deleteFile() {
      // TODO: Remove asset from server.
      this.$emit('update', this.meta.key, null);
    }
  },
  components: { CircularProgress }
};

function readSpecifiers(config) {
  const specifiers = [];
  const rules = config.rules || config;
  if (Array.isArray(rules.ext)) specifiers.push(...rules.ext);
  if (Array.isArray(rules.mimes)) specifiers.push(...rules.mimes);
  return specifiers;
}
</script>

<style lang="scss" scoped>
.control {
  position: relative;
  min-height: 50px;
  margin: 20px 0;
  padding: 3px 8px;

  .title {
    width: 100%;
    margin-bottom: 10px;
    color: #808080;
  }

  &:hover {
    background-color: #f5f5f5;
  }

  &.editing:hover {
    background-color: inherit;
  }
}

.upload-btn {
  padding: 6px 8px;
  background: darken(#fff, 8%);

  &:hover, &.active {
    background: darken(#fff, 16%);
  }
}

.file-link {
  color: #00f;
  font-size: 16px;
  text-decoration: underline;
  cursor: pointer;
}

.delete-btn {
  padding: 0 5px;
  color: #808080;
  font-size: 18px;
  cursor: pointer;

  &:hover {
    color: #555;
  }
}
</style>
