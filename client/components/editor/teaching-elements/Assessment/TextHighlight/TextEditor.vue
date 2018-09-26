<template>
  <quill-editor
    ref="quillEditor"
    :class="enabled ? '' : 'disabled'"
    :options="options"
    :content="content">
  </quill-editor>
</template>

<script>
import forEach from 'lodash/forEach';
import Highlight from './ql-highlight';
import HighlightCollection from './HighlightCollection';
import isEmpty from 'lodash/isEmpty';
import { quillEditor as QuillEditor, Quill } from 'vue-quill-editor';

Quill.register('formats/highlight', Highlight);

const icons = Quill.import('ui/icons');
icons['highlight-add'] = '<span class="icon mdi mdi-marker"></span>';
icons['highlight-subtract'] = '<span class="icon mdi mdi-marker"></span>';

const noUpdate = 'other';

const toolbarContainerOptions = [
  ['bold', 'italic', 'underline', 'strike'],
  ['blockquote', 'code-block'],
  [{ 'header': 1 }, { 'header': 2 }],
  [{ 'list': 'ordered' }, { 'list': 'bullet' }],
  [{ 'script': 'sub' }, { 'script': 'super' }],
  [{ 'indent': '-1' }, { 'indent': '+1' }],
  [{ 'direction': 'rtl' }],
  [{ 'size': ['small', false, 'large', 'huge'] }],
  [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
  [{ 'color': [] }, { 'background': [] }],
  [{ 'font': [] }],
  [{ 'align': [] }],
  ['clean'],
  ['link', 'image', 'video'],
  ['highlight-add', 'highlight-subtract']
];

export default {
  props: {
    text: { type: String, required: true },
    answers: { type: Array, required: true },
    highlightWildcards: { type: Array, default: () => [] },
    enabled: { type: Boolean, default: true }
  },
  data() {
    return {
      options: {
        modules: {
          toolbar: {
            container: toolbarContainerOptions,
            handlers: {
              'highlight-add': this.onHighlightAdd,
              'highlight-subtract': this.onHighlightSubtract
            }
          }
        }
      },
      isHighlighting: null,
      content: '',
      highlights: new HighlightCollection(),
      wildcards: new HighlightCollection()
    };
  },
  computed: {
    textEditor() {
      return this.$refs.quillEditor.quill;
    }
  },
  methods: {
    update() {
      this.refreshEditorHighlights();
      this.$emit('change');
    },
    getText() {
      return getFormattedContent(this.textEditor.getContents());
    },
    getAnswers() {
      return this.highlights.toPlainObjects();
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
    },
    onHighlightAdd() {
      this.isHighlighting = this.isHighlighting ? null : true;
      if (this.isHighlighting) {
        const highlight = this.getCurrentSelection();
        if (!isEmpty(highlight)) this.addHighlight(highlight);
      }
    },
    onHighlightSubtract() {
      this.isHighlighting = this.isHighlighting === false ? null : false;
      if (this.isHighlighting === false) {
        const highlight = this.getCurrentSelection();
        if (!isEmpty(highlight)) this.removeHighlight(highlight);
      }
    },
    getCurrentSelection() {
      const range = this.textEditor.getSelection(true);
      if (!range.length) return {};
      const selectedText = this.textEditor.getText(range.index, range.length);
      return { start: range.index, text: selectedText };
    },
    onSelectionChanged(range, oldRange, source) {
      if (this.isHighlighting === null) return;

      if (range && range.length) {
        const selectedText = this.textEditor.getText(range.index, range.length);

        // prevent current selection from obscuring the new highlight
        if (this.isHighlighting) this.textEditor.blur();

        const highlight = { start: range.index, text: selectedText };
        this.isHighlighting
          ? this.addHighlight(highlight)
          : this.removeHighlight(highlight);
      }

      this.update();
    },
    onContentChanged(delta, oldContent, source) {
      this.content = this.textEditor.root.innerHTML;
      const text = getPlainContent(this.content);
      this.highlights.updateForText(text);
      this.wildcards.updateForText(text);

      if (source !== noUpdate) this.update();
    },
    addHighlight(highlight) {
      this.highlights.addHighlight(highlight.start, highlight.text);
      this.refreshEditorHighlights();
      this.update();
    },
    removeHighlight(highlight) {
      this.highlights.removeHighlight(highlight.start, highlight.text);
      this.refreshEditorHighlights();
      this.update();
    },
    refreshEditorHighlights() {
      const getData = h => ({ start: h.start, length: h.text.length });
      let highlights = this.highlights.toPlainObjects();
      const wildcards = this.wildcards.toPlainObjects();
      highlights = highlights.concat(wildcards);

      this.renderHighlights(highlights.map(h => getData(h)));
    },
    recalculateWildcards() {
      let wildcardHighlights = [];

      forEach(this.highlightWildcards, text => {
        const wildcardIndices = getOccurrenceIndices(
          getPlainContent(this.content),
          text
        );
        const wildcards = wildcardIndices.map(index => ({ start: index, text }));
        wildcardHighlights = wildcardHighlights.concat(wildcards);
      });

      this.wildcards = HighlightCollection.fromPlainObjects(wildcardHighlights);
    }
  },
  watch: {
    isHighlighting() {
      if (this.isHighlighting === null) return setHighlightToolbarLabelText('OFF');
      const label = this.isHighlighting ? 'ADD' : 'SUBTRACT';
      setHighlightToolbarLabelText(label);
    },
    highlightWildcards() {
      this.recalculateWildcards();
      this.refreshEditorHighlights();
    }
  },
  created() {
    this.content = this.text;
    this.highlights = HighlightCollection.fromPlainObjects(this.answers);
  },
  mounted() {
    addHighlightToolbarLabel();

    this.textEditor.on('selection-change', this.onSelectionChanged);
    this.textEditor.on('text-change', this.onContentChanged);

    this.recalculateWildcards();
    this.refreshEditorHighlights();
  },
  components: { QuillEditor }
};

function addHighlightToolbarLabel() {
  const addButton = document.getElementsByClassName('ql-highlight-add')[0];
  const buttonsParent = addButton.parentElement;

  const label = document.createElement('span');
  label.classList.add('highlight-mode');
  label.innerHTML = `
    Highlight mode: <span id="highlight-mode-toolbar-label" class="label">OFF</span>
  `;

  buttonsParent.appendChild(label);
}

function setHighlightToolbarLabelText(text) {
  const label = document.getElementById('highlight-mode-toolbar-label');
  if (label) label.innerHTML = text;
}

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
  .ql-highlight {
    color: #fff;
    background: $highlight;

    &-add, &-subtract {
      margin: 0 1px;
      padding: 1px;
      color: #fff;
    }

    &-add {
      background: #1b1;
    }

    &-subtract {
      background: #b11;
    }
  }

  .highlight-mode {
    width: auto;
    padding: 5px;
    font-size: 10px;

    .label {
      padding: 0;
      color: $highlight;
      font-size: 10px;
      font-weight: bold;
    }
  }
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
