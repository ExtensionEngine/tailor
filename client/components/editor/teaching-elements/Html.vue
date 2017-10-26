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
        :options="options"
        @ready="onQuillReady">
      </quill-editor>
      <div v-else class="ql-container ql-snow">
        <div v-html="content" class="ql-editor"></div>
      </div>
    </div>
  </div>
</template>

<script>
import debounce from 'lodash/debounce';
import get from 'lodash/get';
import { quillEditor } from 'vue-quill-editor';

export default {
  name: 'te-html',
  props: ['element', 'isFocused'],
  data() {
    return {
      content: get(this.element, 'data.content', ''),
      options: { modules: { toolbar: '#quillToolbar' } }
    };
  },
  methods: {
    onQuillReady(quill) {
      quill.focus();
      if (quill.root) {
        quill.root.innerHTML = this.content;
      }
    },
    save() {
      if (!this.hasChanges) return;
      this.$emit('save', { content: this.content });
    }
  },
  computed: {
    hasChanges() {
      const previousValue = get(this.element, 'data.content', '');
      return previousValue !== this.content;
    }
  },
  watch: {
    element(val) {
      this.content = get(val, 'data.content', '');
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
.te-html {
  .ql-editor {
    min-height: 117px;
  }

  .ql-container.ql-snow {
    border: none !important;
  }

  .ql-editor.ql-blank::before {
    width: 100%;
  }
}
</style>
