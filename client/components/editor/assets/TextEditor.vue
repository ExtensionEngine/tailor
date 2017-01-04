<template>
  <div>
    <quill-editor
      v-if="input"
      v-model="content"
      :config="config"
      @blur="input = false">
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
  components: { quillEditor }
};
</script>

<style lang="scss">
</style>
