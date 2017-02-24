<template>
  <div>
    <div v-if="!isFocused && !data.content">
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
        v-model="data.content"
        :config="config"
        @change="update">
      </quill-editor>
      <div
        v-else
        class="ql-container ql-snow">
        <div
          v-html="data.content"
          class="ql-editor">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep';
import debounce from 'lodash/debounce';
import { quillEditor } from 'vue-quill-editor';

const defaultAsset = {
  data: {
    content: ''
  }
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
    content() {
      return this.data.content;
    }
  },
  methods: {
    update: debounce(
      function () {
        this.$emit('save', { content: this.content });
      }, 500
    )
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
