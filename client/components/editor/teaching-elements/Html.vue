<template>
  <div class="te-html">
    <div v-if="!isFocused && !content">
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
        v-model="content"
        :config="config"
        @ready="onQuillReady"
        ref="quill">
      </quill-editor>
      <div v-else class="ql-container ql-snow">
        <div v-html="content" class="ql-editor"></div>
      </div>
    </div>
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep';
import debounce from 'lodash/debounce';
import { quillEditor } from 'vue-quill-editor';

export default {
  name: 'te-html',
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
    },
    save() {
      if (!this.$refs.quill || !this.hasChanges) return;
      const text = this.$refs.quill.quillEditor.getText().trim();
      this.$emit('save', { content: text ? this.content : '' });
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
      if (oldVal && !val) this.save();
    },
    content: debounce(function () {
      this.save();
    }, 2000)
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

.ql-editor.ql-blank:before {
  width: 100%;
}
</style>
