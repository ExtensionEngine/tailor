<template>
  <div class="quill-input">
    <label :for="meta.key">{{ meta.label }}</label>
    <div>
      <div class="editor-wrapper">
        <quill-editor
          v-if="editing"
          v-model="content"
          :ref="meta.key"
          :name="meta.key"
          :options="quillOptions"
          @ready="editor => editor.focus()"
          @blur="update">
        </quill-editor>
        <div v-else @click="editing = true" class="ql-container ql-snow">
          <div v-html="content || meta.placeholder" class="ql-editor"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { quillEditor as QuillEditor, Quill } from 'vue-quill-editor';

const quillOptions = () => ({
  modules: {
    toolbar: [
      ['bold', 'italic', 'underline'],
      ['blockquote'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ script: 'sub' }, { script: 'super' }],
      ['link', 'image']
    ]
  }
});

export default {
  name: 'html-input',
  props: {
    meta: { type: Object, default: () => ({ value: null }) },
    quillOptions: { type: Object, default: quillOptions }
  },
  data() {
    return {
      content: this.meta.value,
      editing: false
    };
  },
  methods: {
    update() {
      this.editing = false;
      if (this.meta.value === this.content) return;
      this.$emit('update', this.meta.key, this.content);
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
