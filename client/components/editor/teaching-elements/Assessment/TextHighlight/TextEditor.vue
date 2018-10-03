<template>
  <div class="te-html">
    <div v-if="!enabled && !content">
      <div class="well text-placeholder">
        <div class="message">
          <span v-if="!content">
            <span class="heading">Text placeholder</span>
            <span>Click to edit</span>
          </span>
          <span v-else>{{ content }}</span>
        </div>
      </div>
    </div>
    <div v-else>
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
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep';
import Highlight from './highlight.format';
import { getPlainContent } from './helpers';
import isEmpty from 'lodash/isEmpty';
import { quillEditor as QuillEditor, Quill } from 'vue-quill-editor';
import Wildcard from './wildcard.format';

Quill.register('formats/highlight', Highlight);
Quill.register('formats/wildcard', Wildcard);

const noUpdate = 'other';

const toolbar = handlers => ({ container: '#highlightQuillToolbar', handlers });
const options = eventHandlers => ({
  modules: {
    toolbar: toolbar(eventHandlers),
    imageEmbed: { spacing: 1 }
  }
});

export default {
  props: {
    text: { type: String, required: true },
    answers: { type: Object, required: true },
    wildcards: { type: Object, default: () => {} },
    enabled: { type: Boolean, default: true }
  },
  data() {
    return {
      content: String(this.text),
      highlights: cloneDeep(this.answers)
    };
  },
  computed: {
    options() {
      return this.enabled
        ? options({ highlight: this.onHighlight })
        : { modules: { toolbar: false } };
    }
  },
  methods: {
    update() {
      this.refreshEditorHighlights();
      this.$emit('change');
    },
    getTextEditor() {
      return this.$refs.quillEditor.quill;
    },
    getText() {
      return getFormattedContent(this.getTextEditor().getContents(), true);
    },
    getAnswers() {
      return this.highlights;
    },
    onHighlight(isApplicable) {
      const highlight = this.getCurrentSelection();
      if (isEmpty(highlight)) return;

      isApplicable
        ? this.addHighlight(highlight)
        : this.removeHighlight(highlight);
    },
    getCurrentSelection() {
      const textEditor = this.getTextEditor();
      const range = textEditor.getSelection(true);

      if (!range.length) return {};

      const selectedText = textEditor.getText(range.index, range.length);
      return { start: range.index, text: selectedText };
    },
    onContentChanged(delta, oldContent, source) {
      this.content = this.getTextEditor().root.innerHTML;
      const text = getPlainContent(this.content);
      this.highlights.updateForText(text);
      this.wildcards.updateForText(text);

      if (source !== noUpdate) this.update();
    },
    addHighlight(highlight) {
      this.highlights.addHighlight(highlight.start, highlight.text);
      this.update();
    },
    removeHighlight(highlight) {
      this.highlights.removeHighlight(highlight.start, highlight.text);
      this.update();
    },
    refreshEditorHighlights() {
      refreshTags(
        this.getTextEditor(),
        this.highlights.toPlainObjects(),
        this.wildcards.toPlainObjects()
      );
    },
    onQuillReady(quill) {
      this.getTextEditor().on('text-change', this.onContentChanged);
      this.refreshEditorHighlights();
    },
    getFormattedHtml() {
      const highlights = this.highlights.toPlainObjects();
      const wildcards = this.wildcards.toPlainObjects();

      return getFormattedContent(this.content, false, { highlights, wildcards });
    }
  },
  watch: {
    wildcards() {
      this.refreshEditorHighlights();
    }
  },
  components: { QuillEditor }
};

function getFormattedContent(content, isDelta, tags = {}) {
  const tempEditor = new Quill(document.createElement('div'));
  const container = tempEditor.container.getElementsByClassName('ql-editor')[0];

  isDelta ? tempEditor.setContents(content) : container.innerHTML = content;

  clearTags(tempEditor);

  if (!isEmpty(tags)) {
    const { highlights, wildcards } = tags;
    refreshTags(tempEditor, highlights || [], wildcards || []);
  }

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

function refreshTags(editor, highlights, wildcards) {
  clearTags(editor);
  highlights.forEach(it => addHighlightTag(editor, it.start, it.text.length));
  wildcards.forEach(it => addWildcardTag(editor, it.start, it.text.length));
}
</script>

<style lang="scss" scoped>
$highlight: #2f73e9;
$wildcard: #144acc;
$editorHeight: 117px;
$editorBorder: 1px dotted #ccc;

/* TODO: merge duplicate CSS entries */
.te-html /deep/ {
  .ql-editor {
    min-height: $editorHeight;
    border: $editorBorder;
  }

  .text-editor {
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
  border: $editorBorder;

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
