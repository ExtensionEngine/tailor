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
        @ready="onQuillReady">
      </quill-editor>
      <div v-else class="ql-container ql-snow">
        <div v-html="content" class="ql-editor"></div>
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

Quill.register('formats/highlight', Highlight);

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
      options: options({ highlight: this.onHighlight }),
      content: this.text,
      highlights: cloneDeep(this.answers)
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
    getText() {
      return getFormattedContent(this.getTextEditor().getContents());
    },
    getAnswers() {
      return this.highlights;
    },
    clearHighlights() {
      const textEditor = this.getTextEditor();
      const textLength = textEditor.getLength();
      textEditor.formatText(0, textLength, { highlight: false }, noUpdate);
    },
    renderHighlights(highlights) {
      this.clearHighlights();
      const textEditor = this.getTextEditor();
      highlights.forEach(({ start, length }) => {
        textEditor.formatText(start, length, { highlight: true }, noUpdate);
      });
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
      const getData = it => ({ start: it.start, length: it.text.length });
      const wildcards = this.wildcards.toPlainObjects();
      const highlights = this.highlights.toPlainObjects().concat(wildcards);

      this.renderHighlights(highlights.map(it => getData(it)));
    },
    onQuillReady(quill) {
      this.getTextEditor().on('text-change', this.onContentChanged);
      this.refreshEditorHighlights();
    }
  },
  watch: {
    wildcards() {
      this.refreshEditorHighlights();
    }
  },
  components: { QuillEditor }
};

function getFormattedContent(quillContents) {
  const tempEditor = new Quill(document.createElement('div'));
  tempEditor.setContents(quillContents);
  tempEditor.formatText(0, tempEditor.getLength(), { highlight: false });
  const children = tempEditor.container.getElementsByClassName('ql-editor');

  return children[0].innerHTML;
}
</script>

<style lang="scss" scoped>
$highlight: #2f73e9;

.quill-editor /deep/ {
  span.ql-highlight {
    color: #fff;
    background: $highlight;
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

<style lang="scss">
.te-html {
  .ql-editor {
    min-height: 117px;

    img {
      vertical-align: initial;
    }
  }

  .ql-container.ql-snow {
    border: none !important;
  }

  .ql-editor.ql-blank::before {
    width: 100%;
  }
}
</style>
