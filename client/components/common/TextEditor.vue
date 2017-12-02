<template>
  <div :class="{ preview }" class="form-group text-editor">
    <textarea
      v-model="content"
      v-focus.lazy="focused"
      :placeholder="placeholder"
      @keydown.enter="onEnter"
      @input="$emit('input', content)"
      @blur="$emit('change', content)"
      class="form-control">
    </textarea>
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
    placeholder: { type: String, default: '' },
    preview: { type: Boolean, default: false },
    focused: { type: Boolean, default: false }
  },
  data() {
    return { content: this.value };
  },
  methods: {
    onEnter(e) {
      if (e.shiftKey) return;
      e.preventDefault();
      this.$emit('change', this.content);
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
.text-editor {
  position: relative;
  margin: 0;

  textarea {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    background: transparent;
    font: inherit;
    letter-spacing: inherit;
    box-sizing: content-box;
    overflow: hidden;
    resize: none;
    outline: none;

    &:focus {
      outline: none;
    }
  }

  .content {
    visibility: hidden;
  }

  .content pre {
    height: 100%;
    margin: 0;
    //NOTE: Preventing glitches (height changes, vertical scrollbar)
    padding: 0 4px 8px 0;
    font: inherit;
    background: inherit;
    border: none;
    word-break: break-all;
    word-wrap: break-word;
    white-space: pre-wrap;
    overflow: hidden;
  }
}

.text-editor.preview {
  textarea {
    display: none;
  }

  .content {
    visibility: visible;
  }
}
</style>
