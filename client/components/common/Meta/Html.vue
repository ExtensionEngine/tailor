<template>
  <div class="html-input">
    <label :for="meta.key">{{ meta.label }}</label>
    <quill-editor
      v-model="content"
      :options="quillOptions">
    </quill-editor>
  </div>
</template>

<script>
import { quillEditor as QuillEditor, Quill } from 'vue-quill-editor';

const quillOptions = () => ({
  modules: {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ script: 'sub' }, { script: 'super' }],
      [{ color: [] }, { background: [] }],
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
      value: this.meta.value,
      content: null
    };
  },
  components: {
    QuillEditor,
    Quill
  }
};
</script>

<style lang="scss" scoped>
.html-input {
  position: relative;
  padding: 3px 8px;
  margin: 15px 0 35px 0;
  cursor: pointer;
}
</style>
