<template>
  <quill-editor
    ref="quillEditor"
    :class="enabled ? '' : 'disabled'"
    :content="content">
  </quill-editor>
</template>

<script>
import forEach from 'lodash/forEach';
import Highlight from './ql-highlight';
import { quillEditor as QuillEditor, Quill } from 'vue-quill-editor';

Quill.register('formats/highlight', Highlight);

const noUpdate = 'other';

export default {
  props: {
    text: { type: String, required: true },
    enabled: { type: Boolean, default: true }
  },
  data() {
    return {
      content: ''
    };
  },
  computed: {
    textEditor() {
      return this.$refs.quillEditor.quill;
    }
  },
  methods: {
    getPlainContent(startIndex, endIndex) {
      const temp = document.createElement('div');
      temp.innerHTML = this.content;

      return temp.innerText.substring(startIndex, endIndex + 1);
    },
    getFormattedContent() {
      const tempEditor = new Quill(document.createElement('div'));
      tempEditor.setContents(this.textEditor.getContents());
      tempEditor.formatText(0, tempEditor.getLength(), { highlight: false });
      const children = tempEditor.container.getElementsByClassName('ql-editor');

      return children[0].innerHTML;
    },
    clearHighlights() {
      const textLength = this.textEditor.getLength();
      this.textEditor.formatText(0, textLength, { highlight: false }, noUpdate);
    },
    renderHighlights(highlights) {
      this.clearHighlights();
      forEach(highlights, ({ start, length }) => {
        this.textEditor.formatText(start, length, { highlight: true }, noUpdate);
      });
    }
  },
  created() {
    this.content = this.text;
  },
  mounted() {
    this.textEditor.on('selection-change', (range, oldRange, source) => {
      if (range && range.length) {
        const selectedText = this.textEditor.getText(range.index, range.length);
        this.$emit('selectionChange', range.index, selectedText);
      }
    });

    this.textEditor.on('text-change', (delta, oldContent, source) => {
      this.content = this.textEditor.root.innerHTML;
      if (source !== noUpdate) this.$emit('contentChange');
    });
  },
  components: { QuillEditor }
};
</script>

<style lang="scss" scoped>
.quill-editor /deep/ .ql-highlight {
  color: #fff;
  background: #144acc;
}

.quill-editor.disabled /deep/ {
  .ql-toolbar {
    display: none;
  }

  .ql-container {
    pointer-events: none;
    border: 1px solid #ccc;
  }
}
</style>
