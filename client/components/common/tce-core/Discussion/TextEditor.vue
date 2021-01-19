<template>
  <div :class="{ preview: showPreview }" class="comment-editor">
    <div v-if="showPreview" :class="{ resolved: isResolved }" class="content">
      <p v-if="isResolved" class="resolved-label">Marked as resolved</p>
      <pre><span>{{ value }}</span><br></pre>
    </div>
    <v-textarea
      v-else
      @input="$emit('input', $event)"
      :value="value"
      :autofocus="isFocused"
      :placeholder="placeholder"
      rows="3"
      outlined auto-grow clearable counter />
  </div>
</template>

<script>
export default {
  name: 'text-editor',
  props: {
    value: { type: String, default: '' },
    isFocused: { type: Boolean, default: false },
    showPreview: { type: Boolean, default: false },
    isResolved: { type: Boolean, default: false },
    placeholder: { type: String, default: 'Add a comment...' }
  }
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
    word-break: break-all;
    word-wrap: break-word;
    overflow-wrap: break-word;
    background: inherit;
    border: none;
    overflow: hidden;
  }

  .content.resolved {
    opacity: 0.7;

    .resolved-label {
      margin-bottom: 0.25rem;
      font-size: 0.75rem;
      font-style: italic;
      opacity: 0.7;
    }
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
