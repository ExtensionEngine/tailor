<template>
  <div v-if="!enabled && !content" class="no-content-placeholder">
    <div class="message">
      <span class="heading">Text placeholder</span>
      <span>Click to edit</span>
    </div>
  </div>
  <div v-else :class="enabled ? 'active' : 'inactive'" class="editor-container">
    <quill-editor
      v-if="enabled"
      ref="quillEditor"
      :options="options"
      :content="content"
      @ready="onQuillReady"
      class="text-editor">
    </quill-editor>
    <div v-else class="ql-container ql-snow text-editor">
      <p v-html="getFormattedHtml()" class="ql-editor"></p>
    </div>
  </div>
</template>

<script>
import { adjustForWildcards, getPlainContent } from './helpers';
import Highlight from './Highlight';
import HighlightFormat from './highlight.format';
import Highlights from './Highlights';
import { quillEditor as QuillEditor, Quill } from 'vue-quill-editor';
import WildcardFormat from './wildcard.format';

Quill.register('formats/highlight', HighlightFormat);
Quill.register('formats/wildcard', WildcardFormat);

const noUpdate = 'other';

const toolbar = handlers => ({ container: '#highlightQuillToolbar', handlers });
const options = eventHandlers => ({
  placeholder: 'Insert text here',
  modules: {
    toolbar: toolbar(eventHandlers),
    imageEmbed: { spacing: 1 }
  }
});

export default {
  props: {
    text: { type: String, required: true },
    answers: { type: Object, required: true },
    enabled: { type: Boolean, default: true }
  },
  data() {
    return {
      content: String(this.text),
      highlights: (new Highlights()).update(this.answers),
      options: options({ highlight: this.onHighlight })
    };
  },
  methods: {
    update() {
      this.refreshEditorHighlights();
      this.$emit('change');
    },
    getTextEditor() {
      return this.$refs.quillEditor.quill;
    },
    getAnswers() {
      return this.highlights.toPlainObjects();
    },
    getText() {
      return getFormattedContent(this.getTextEditor().getContents(), true);
    },
    onHighlight(isApplicable) {
      const { highlight, hasRange } = this.getCurrentSelection();
      if (!highlight) return;
      if (isApplicable && !hasRange) return;

      isApplicable
        ? this.highlights.addHighlight(highlight)
        : this.highlights.removeHighlight(highlight);
    },
    getCurrentSelection() {
      const textEditor = this.getTextEditor();
      const { index, length } = textEditor.getSelection(true);
      const selection = { highlight: null, hasRange: !!length };

      if (selection.hasRange) {
        const text = textEditor.getText(index, length);
        selection.highlight = adjustForWildcards(
          new Highlight(index, text),
          this.highlights.wildcards
        );
      } else {
        selection.highlight = this.highlights.findByTextIndex(index);
      }

      return selection;
    },
    onContentChanged(delta, oldContent, source) {
      this.content = this.getTextEditor().root.innerHTML;

      if (source === noUpdate) return;

      const change = getChange(delta);
      if (change) {
        const text = getPlainContent(this.content);
        this.highlights.updateForText(text, change);
      }

      this.update();
    },
    refreshEditorHighlights() {
      refreshTags(
        this.getTextEditor(),
        this.highlights.items
      );
    },
    onQuillReady(quill) {
      this.getTextEditor().on('text-change', this.onContentChanged);
      this.refreshEditorHighlights();
    },
    getFormattedHtml() {
      if (!this.content.length) {
        const text = 'Click here to start editing';
        return `<span style="color: #aaa; font-size: 20px;">${text}</span>`;
      }

      return getFormattedContent(this.content, false, this.highlights.items);
    },
    removeHighlight(highlight) {
      this.highlights.addHighlight(highlight);
    },
    addWildcard(wildcard) {
      this.highlights.addWildcard(wildcard, getPlainContent(this.content));
    },
    removeWildcard(wildcard) {
      this.highlights.removeWildcard(wildcard);
    }
  },
  watch: {
    highlights: {
      handler: function (newVal, oldVal) {
        this.refreshEditorHighlights();
        if (!this.highlights.equals(this.answers)) this.update();
      },
      deep: true
    },
    answers: {
      handler: function (newVal, oldVal) {
        this.highlights.update(this.answers);
      },
      deep: true
    }
  },
  components: { QuillEditor }
};

function getFormattedContent(content, isDelta, highlights = []) {
  const tempEditor = new Quill(document.createElement('div'));
  const container = tempEditor.container.getElementsByClassName('ql-editor')[0];

  isDelta ? tempEditor.setContents(content) : container.innerHTML = content;

  clearTags(tempEditor);
  if (highlights.length) refreshTags(tempEditor, highlights);

  return container.innerHTML;
}

function addHighlightTag(textEditor, start, length) {
  textEditor.formatText(start, length, { highlight: true }, noUpdate);
}

function addWildcardTag(textEditor, start, length) {
  textEditor.formatText(start, length, { wildcard: true }, noUpdate);
}

function clearTags(textEditor) {
  const options = { highlight: false, wildcard: false };
  textEditor.formatText(0, textEditor.getLength(), options, noUpdate);
}

function refreshTags(editor, highlights) {
  clearTags(editor);

  highlights.forEach(it => {
    if (it.isWildcard) return addWildcardTag(editor, it.start, it.length);
    return addHighlightTag(editor, it.start, it.length);
  });
}

function getChange(delta) {
  if (!delta.ops || delta.ops.length !== 2) return null;

  const change = delta.ops[1];
  if (!change.delete && !change.insert) return null;

  const modifier = change.delete ? -(change.delete) : change.insert.length;
  return { start: delta.ops[0].retain, modifier };
}
</script>

<style lang="scss" scoped>
$highlight: #2f73e9;
$wildcard: #144acc;
$editorHeight: 128px;

.editor-container.active {
  border: 1px solid #90a4ae;
  box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.15);
}

.editor-container.inactive {
  background: #eee;
  border: 1px dotted #ccc;
  user-select: none;
}

/* TODO: merge duplicate CSS entries */
.editor-container /deep/ {
  .ql-container {
    border: none !important;
  }

  .ql-editor {
    min-height: $editorHeight;
    margin-bottom: 0;
  }

  .text-editor {
    margin: 10px 20px;

    span.ql-highlight {
      color: #fff;
      background: $highlight;
    }

    span.ql-wildcard {
      color: #fff;
      background: $wildcard;
    }
  }
}

.quill-editor /deep/ {
  min-height: $editorHeight;
  border: none !important;

  img {
    vertical-align: initial;
  }

  span.ql-highlight {
    color: #fff;
    background: $highlight;
  }

  span.ql-wildcard {
    color: #fff;
    background: $wildcard;
  }
}

.no-content-placeholder {
  margin-bottom: 0;
  padding: 10px 20px;
  border: 1px dotted #ccc;

  .message {
    min-height: $editorHeight;
    padding: 28px;
    background: #f5f5f5;
    border: 1px solid #e3e3e3;
    text-align: center;

    .heading {
      font-size: 24px;
    }

    span {
      display: block;
      font-size: 18px;
    }
  }
}

.no-content-placeholder, .editor-container {
  width: 100%;
  margin: 0;
}
</style>
