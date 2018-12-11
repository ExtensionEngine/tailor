<template>
  <div class="html-input">
    <label :for="meta.key">{{ meta.label }}</label>
    <quill-editor
      v-model="content">
    </quill-editor>
  </div>
</template>

<script>
import { quillEditor as QuillEditor, Quill } from 'vue-quill-editor';

export default {
  name: 'html-input',
  props: {
    meta: { type: Object, default: () => ({ value: null }) },
    minHeight: { type: Number, default: 100 }
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
