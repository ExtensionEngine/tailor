<template>
  <div class="form-group text-editor">
    <textarea
      v-model="content"
      :placeholder="placeholder"
      @keydown.enter="onEnter"
      @input="$emit('input', content)"
      class="form-control">
    </textarea>
    <div :style="{ minHeight: `${this.height}px` }" class="content">
      <pre><span>{{ content }}</span><br></pre>
    </div>
  </div>
</template>

<script>
export default {
  name: 'text-editor',
  props: {
    value: { type: String, required: true },
    placeholder: { type: String, default: '' },
    height: { type: Number, default: 60 }
  },
  data() {
    return { content: this.value };
  },
  methods: {
    onEnter(e) {
      if (e.shiftKey) return;
      e.preventDefault();
      if (this.content) this.$emit('change', this.content);
    }
  },
  watch: {
    value() {
      this.content = this.value;
    }
  }
};
</script>

<style lang="scss">
.text-editor {
  position: relative;
  margin-bottom: 10px;
  font-size: inherit;
  line-height: inherit;

  textarea {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    font: inherit;
    box-sizing: content-box;
    overflow: hidden;
    resize: none;
    letter-spacing: inherit;
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
</style>
