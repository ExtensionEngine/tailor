<template>
  <div class="quill-input">
    <label :for="meta.key">{{ meta.label }}</label>
    <div class="editor-wrapper">
      <quill-editor
        v-model="content"
        :ref="meta.key"
        :name="meta.key"
        :options="getQuillOptions()">
      </quill-editor>
    </div>
  </div>
</template>

<script>
import { quillEditor as QuillEditor, Quill } from 'vue-quill-editor';

const defaultData = [
  ['bold', 'italic', 'underline'],
  ['blockquote'],
  [{ list: 'ordered' }, { list: 'bullet' }],
  [{ script: 'sub' }, { script: 'super' }],
  ['link', 'image']
];

export default {
  name: 'html-input',
  props: {
    meta: { type: Object, default: () => ({ value: null }) },
    quillOptionsData: { type: Array, default() { return defaultData; } }
  },
  data() {
    return {
      value: this.meta.value,
      content: null,
      editing: false
    };
  },
  methods: {
    getQuillOptions() {
      return {
        modules: {
          toolbar: this.quillOptionsData
        }
      };
    }
  },
  components: {
    QuillEditor,
    Quill
  }
};
</script>

<style lang="scss" scoped>
.quill-input {
  position: relative;
  padding: 10px 8px;
  margin: 0 0 20px 0;
  cursor: pointer;
}

.quill-input:hover:not(:focus-within) {
  background: #f5f5f5;
}

.quill-input:focus-within {
  background: initial;
}
</style>
