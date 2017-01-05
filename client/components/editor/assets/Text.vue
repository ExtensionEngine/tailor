<template>
  <div>
    <quill-editor
      v-if="input"
      v-model="content"
      :config="config"
      @blur="onEditorBlur">
    </quill-editor>
    <div
      v-else
      v-html="content"
      @click="input = true"
      class="ql-editor">
    </div>
  </div>
</template>

<script>
import { quillEditor } from 'vue-quill-editor';

export default {
  name: 'text-editor',
  data() {
    return {
      input: true,
      content: '',
      config: { modules: { toolbar: '#quillToolbar' } }
    };
  },
  methods: {
    onEditorBlur(editor) {
      this.input = false;
    }
  },
  components: { quillEditor }
};
</script>

<style lang="scss">
</style>
