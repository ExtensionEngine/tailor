<template>
  <div>
    <quill-editor
      v-if="isFocused"
      v-model="content"
      :config="config">
    </quill-editor>
    <div
      v-else
      v-html="content"
      class="ql-editor">
    </div>
  </div>
</template>

<script>
import { quillEditor } from 'vue-quill-editor';

export default {
  name: 'text-editor',
  props: ['asset', 'isFocused'],
  data() {
    return {
      content: '',
      config: { modules: { toolbar: '#quillToolbar' } }
    };
  },
  components: { quillEditor }
};
</script>
