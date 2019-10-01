<template>
  <div :class="{ preview }" class="text-editor">
    <v-textarea
      v-if="!preview"
      v-model.trim="content"
      @keydown.shift.enter.exact="() => {}"
      @keydown.enter.exact.prevent="onEnter"
      @blur="onBlur"
      @input="$emit('input', content)"
      autofocus
      single-line
      hide-details
      auto-grow
      rows="1"
      :placeholder="placeholder" />
    <div v-else class="content">
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
    preview: { type: Boolean, default: false }
  },
  data() {
    return { content: this.value };
  },
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

<style lang="scss" scoped>
.text-editor {
  margin: 0;

  .v-textarea {
    width: 100%;
    margin: 0;
    padding: 0;

    ::v-deep textarea {
      padding: 0;
      padding-bottom: 8px;
      line-height: inherit;
    }
  }

  .content pre {
    height: 100%;
    margin: 0;
    //NOTE: Preventing glitches (height changes, vertical scrollbar)
    padding-bottom: 12px;
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
</style>
