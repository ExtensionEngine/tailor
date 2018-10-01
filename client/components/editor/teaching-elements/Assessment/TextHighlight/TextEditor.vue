<template>
  <div class="te-html">
    <div v-if="!enabled && !content">
      if
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
import Highlight from './highlight.format';
import HighlightCollection from './HighlightCollection';
import isEmpty from 'lodash/isEmpty';
import { quillEditor as QuillEditor, Quill } from 'vue-quill-editor';

Quill.register('formats/highlight', Highlight);

const noUpdate = 'other';

const toolbar = handlers => ({
  container: '#highlightQuillToolbar',
  handlers
});

const options = eventHandlers => ({
  modules: {
    toolbar: toolbar(eventHandlers),
    imageEmbed: { spacing: 1 },
    history: { userOnly: true }
  }
});

export default {
  props: {
    text: { type: String, required: true },
    answers: { type: Array, required: true },
    highlightWildcards: { type: Array, default: () => [] },
    enabled: { type: Boolean, default: true }
  },
  data() {
    return {
      options: options({ highlight: this.onHighlight }),
      content: this.text,
      highlights: HighlightCollection.fromPlainObjects(this.answers),
      wildcards: new HighlightCollection()
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
      return this.highlights.toPlainObjects();
    },
    clearHighlights() {
      const textEditor = this.getTextEditor();
      const textLength = textEditor.getLength();
      textEditor.formatText(0, textLength, { highlight: false }, noUpdate);
    },
    renderHighlights(highlights) {
      this.clearHighlights();
      highlights.forEach(({ start, length }) => {
        const textEditor = this.getTextEditor();
        textEditor.formatText(start, length, { highlight: true }, noUpdate);
      });
    },
    onHighlight(isApplicable) {
      const highlight = this.getCurrentSelection();
      if (isEmpty(highlight)) return;
      isApplicable ? this.addHighlight(highlight) : this.removeHighlight(highlight);
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
      let highlights = this.highlights.toPlainObjects();
      const wildcards = this.wildcards.toPlainObjects();
      highlights = highlights.concat(wildcards);

      this.renderHighlights(highlights.map(it => getData(it)));
    },
    recalculateWildcards() {
      let wildcardHighlights = [];

      this.highlightWildcards.forEach(text => {
        const wildcardIndices = getOccurrenceIndices(
          getPlainContent(this.content),
          text
        );
        const wildcards = wildcardIndices.map(index => ({ start: index, text }));
        wildcardHighlights = wildcardHighlights.concat(wildcards);
      });

      this.wildcards = HighlightCollection.fromPlainObjects(wildcardHighlights);
      this.refreshEditorHighlights();
    },
    onQuillReady(quill) {
      this.recalculateWildcards();
      this.getTextEditor().on('text-change', this.onContentChanged);
    }
  },
  watch: {
    highlightWildcards() {
      this.recalculateWildcards();
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

function getPlainContent(text) {
  const temp = document.createElement('div');
  temp.innerHTML = text;

  return temp.innerText;
}

function getOccurrenceIndices(string, substring, lastIndex = 0) {
  if (!string.length) return [];

  const currentIndex = string.indexOf(substring);
  if (currentIndex === -1 || currentIndex + 1 > string.length) return [];

  const newString = string.substring(currentIndex + 1);
  const index = currentIndex + lastIndex;
  const oldIndex = index + 1;

  return [index].concat(getOccurrenceIndices(newString, substring, oldIndex));
}
</script>

<style lang="scss" scoped>
$highlight: #2f73e9;

.quill-editor /deep/ {
  span.ql-highlight {
    padding: 1px;
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
