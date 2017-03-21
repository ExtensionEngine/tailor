<template>
  <div class="te-html">
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
import debounce from 'lodash/debounce';
import { quillEditor } from 'vue-quill-editor';

export default {
  name: 'te-html',
  props: ['element', 'isFocused'],
  data() {
    return {
      content: '',
      ...cloneDeep(this.element.data),
      config: { modules: { toolbar: '#quillToolbar' } }
    };
  },
  computed: {
    hasChanges() {
      const previousValue = this.element.data.content || '';
      return previousValue !== this.content;
    }
  },
  watch: {
    isFocused(val, oldVal) {
      if (oldVal && !val && this.hasChanges) {
        this.$emit('save', { content: this.content });
      }
    },
    content: debounce(function () {
      if (!this.hasChanges) return;
      this.$emit('save', { content: this.content });
    }, 2000)
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
