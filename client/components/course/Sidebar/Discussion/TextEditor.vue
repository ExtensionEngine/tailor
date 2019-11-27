<template>
  <div :class="{ preview }" class="comment-editor">
    <v-textarea
      v-model.trim="content"
      v-focus.lazy="focused"
      @keydown.shift.enter.exact="() => false"
      @keydown.enter.exact.prevent="onEnter"
      @blur="onBlur"
      @input="$emit('input', content)"
      :placeholder="placeholder"
      rows="3"
      color="grey"
      outlined
      filled
      auto-grow
      clearable
      counter />
    <div class="content">
      <pre><span>{{ content }}</span><br></pre>
    </div>
  </div>
</template>

<script>
import { focus } from 'vue-focus';

export default {
  name: 'text-editor',
  props: {
    value: { type: String, required: true },
    focused: { type: Boolean, default: false },
    preview: { type: Boolean, default: false },
    placeholder: { type: String, default: '' }
  },
  data: vm => ({ content: vm.value }),
  methods: {
    onEnter(e) {
      this.$emit('change', this.content);
    },
    onBlur(e, content) {
      this.$emit('blur', this.content, e);
    }
  },
  watch: {
    value() {
      this.content = this.value;
    },
    preview() {
      this.content = this.value;
    }
  },
  directives: { focus }
};
</script>

<style lang="scss">
.comment-editor {
  position: relative;
  margin: 0;

  .content {
    display: none;
  }

  .content pre {
    height: 100%;
    margin: 0;
    // NOTE: Preventing glitches (height changes, vertical scrollbar)
    padding: 0 0.25rem 0.5rem 0;
    font: inherit;
    white-space: pre-wrap;
    word-break: normal;
    word-wrap: break-word;
    overflow-wrap: break-word;
    background: inherit;
    border: none;
    overflow: hidden;
  }
}

.comment-editor.preview {
  .v-textarea {
    display: none;
  }

  .content {
    display: block;
  }
}
</style>
