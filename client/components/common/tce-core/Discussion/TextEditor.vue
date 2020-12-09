<template>
  <div :class="{ preview: showPreview }" class="comment-editor">
    <div v-if="showPreview" class="content">
      <pre><span>{{ content }}</span><br></pre>
    </div>
    <v-textarea
      v-else
      @change="$emit('input', $event)"
      :value="content"
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
    value: { type: String, required: true },
    isFocused: { type: Boolean, default: false },
    showPreview: { type: Boolean, default: false },
    placeholder: { type: String, default: 'Add a comment...' }
  },
  computed: {
    content: vm => vm.value.trim()
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
