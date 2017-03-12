<template>
  <div>
    <div v-if="!isFocused && !content">
      <div class="well text-placeholder">
        <div class="message">
          <span class="heading">Text placeholder</span>
          <span>Click to edit</span>
        </div>
      </div>
    </div>
    <div v-else>
      <quill-editor
        v-if="isFocused"
        v-model="content"
        :config="config">
      </quill-editor>
      <div v-else class="ql-container ql-snow">
        <div v-html="content" class="ql-editor"></div>
      </div>
    </div>
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep';
import { quillEditor } from 'vue-quill-editor';

export default {
  name: 'text-editor',
  props: ['asset', 'isFocused'],
  data() {
    return {
      content: '',
      ...cloneDeep(this.asset.data),
      config: { modules: { toolbar: '#quillToolbar' } }
    };
  },
  computed: {
    localAsset() {
      return {
        content: this.content
      };
    }
  },
  watch: {
    isFocused(val, oldVal) {
      if (oldVal && !val) this.$emit('save', this.localAsset);
    },
    localAsset() {
      if (this.asset.embedded) this.$emit('save', this.localAsset);
    }
  },
  components: { quillEditor }
};
</script>

<style lang="scss" scoped>
.text-placeholder {
  .message {
    padding: 9px;

    .heading {
      font-size: 24px;
    }

    span {
      display: block;
      font-size: 18px;
    }
  }
}

.well {
  margin-bottom: 0;
}
</style>

<style lang="scss">
.ql-editor {
  min-height: 117px;
}

.ql-container.ql-snow {
  border: none !important;
}
</style>
