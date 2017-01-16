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
import cloneDeep from 'lodash/cloneDeep';
import { quillEditor } from 'vue-quill-editor';

const defaultAsset = {
  type: 'text',
  content: ''
};

export default {
  name: 'text-editor',
  props: ['asset', 'isFocused'],
  data() {
    return {
      ...cloneDeep(defaultAsset),
      ...cloneDeep(this.asset),
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
    }
  },
  components: { quillEditor }
};
</script>
