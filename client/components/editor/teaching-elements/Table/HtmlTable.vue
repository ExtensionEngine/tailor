<template>
  <div class="te-html-table">
    <quill-editor
      v-if="isFocused"
      v-model="content"
      :config="config"
      @ready="onQuillReady">
    </quill-editor>
    <div v-else class="ql-container ql-snow">
      <div v-html="content" class="ql-editor"></div>
    </div>
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep';
import debounce from 'lodash/debounce';
import { quillEditor } from 'vue-quill-editor';

export default {
  name: 'te-html-table',
  props: ['element', 'isFocused'],
  data() {
    return {
      content: '',
      ...cloneDeep(this.element.data),
      config: { modules: { toolbar: '#quillToolbar' } }
    };
  },
  methods: {
    onQuillReady(quill) {
      quill.focus();
    }
  },
  computed: {
    hasChanges() {
      const previousValue = this.element.data.content || '';
      return previousValue !== this.content;
    }
  },
  watch: {
    element(val) {
      this.content = val.data.content;
    },
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

<style lang="scss">
.te-html-table {
  height: 100%;

  .ql-editor {
    min-height: 42px;
    padding: 8 !important;
  }

  .ql-container.ql-snow {
    border: none !important;
  }
}
</style>
