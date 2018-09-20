<template>
  <div class="form-group">
    <span class="form-label">Answer</span>
    <span :class="{ 'has-error': correctError }" class="answer">
      <span class="highlight-container">
        <!-- TODO: remove button, add 'highlight' option to toolbar instead -->
        <button
          :class="isHighlighting ? 'highlight-add' : 'highlight-remove'"
          @click="isHighlighting = !isHighlighting"
          class="highlight-btn"
          type="button">
          <span class="icon mdi mdi-pencil"></span>
        </button>
        Highlighting mode: {{ isHighlighting ? 'ADD' : 'SUBTRACT' }}
      </span>
      <quill-editor
        ref="quillEditor"
        :content="content"
        :options="options">
      </quill-editor>
      <!-- TODO: display current highlights here -->
    </span>
  </div>
</template>

<script>
import { defaults } from 'utils/assessment';
import forEach from 'lodash/forEach';
import forEachRight from 'lodash/forEachRight';
import Highlight from './Highlight';
import HighlightTag from './ql-highlight';
import isEmpty from 'lodash/isEmpty';
import { quillEditor as QuillEditor, Quill } from 'vue-quill-editor';
import sortBy from 'lodash/sortBy';

Quill.register('formats/highlight', HighlightTag);

export default {
  name: 'text-highlight',
  props: {
    assessment: { type: Object, default: defaults.TR },
    errors: { type: Array, default: () => ([]) },
    isEditing: { type: Boolean, default: false }
  },
  data() {
    return {
      content: '',
      options: {},
      highlights: [],
      isHighlighting: true
    };
  },
  computed: {
    correctError() {
      return this.errors.includes('correct');
    },
    textEditor() {
      return this.$refs.quillEditor.quill;
    }
  },
  methods: {
    update() {
      this.$emit('update', {
        text: this.getFormattedContentWithoutHighlightTags(),
        answers: Highlight.toPlainObjects(this.highlights)
      });
    },
    getContent(includeFormatting) {
      if (includeFormatting) return this.content;

      const temp = document.createElement('div');
      temp.innerHTML = this.content;
      return temp.innerText;
    },
    getFormattedContentWithoutHighlightTags() {
      // TODO: this method could be merged with getContent()
      const tempEditor = new Quill(document.createElement('div'));
      tempEditor.setContents(this.textEditor.getContents());
      tempEditor.formatText(0, tempEditor.getLength(), { highlight: false });
      const children = tempEditor.container.getElementsByClassName('ql-editor');

      return children[0].innerHTML;
    },
    onSelectionChanged(range, oldRange, source) {
      if (range && range.length) {
        const selectedText = this.textEditor.getText(range.index, range.length);
        const highlight = new Highlight(range.index, selectedText);

        // stop current selection from obscuring the new highlight
        if (this.isHighlighting) this.textEditor.blur();

        return this.isHighlighting
          ? this.addHighlight(highlight)
          : this.removeHighlight(highlight);
      }
    },
    addHighlight(highlight) {
      // TODO: simplify code and/or extract parts of it into a helper
      const { innerIndices, outerIndices, outerLeft, outerRight, containing } =
        getRelatedHighlights(highlight, this.highlights);

      if (containing) return;

      if (isEmpty(innerIndices) && isEmpty(outerIndices)) {
        return this.highlights.push(highlight);
      }

      const text = this.getContent(false);

      if (outerLeft && outerLeft.start < highlight.start) {
        const endIndex = highlight.end;
        highlight.start = outerLeft.start;
        highlight.text = text.substring(highlight.start, endIndex + 1);
      }

      if (outerRight && outerRight.end > highlight.end) {
        highlight.text = text.substring(highlight.start, outerRight.end + 1);
      }

      this.removeHighlightsByIndices(innerIndices.concat(outerIndices));
      this.highlights.push(highlight);
    },
    removeHighlight(highlight) {
      // TODO: simplify code and/or extract parts of it into a helper
      const { innerIndices, outerIndices, outerLeft, outerRight, containing } =
        getRelatedHighlights(highlight, this.highlights);

      const text = this.getContent(false);

      if (containing) {
        const endIndex = containing.end;
        containing.text = text.substring(containing.start, highlight.start);
        highlight.start = highlight.end + 1;
        highlight.text = text.substring(highlight.start, endIndex + 1);

        return this.highlights.push(highlight);
      }

      if (isEmpty(innerIndices) && isEmpty(outerIndices)) return;

      if (outerLeft && outerLeft.end >= highlight.start) {
        outerLeft.text = text.substring(outerLeft.start, highlight.start);
      }

      if (outerRight && outerRight.start <= highlight.end) {
        const endIndex = outerRight.end;
        outerRight.start = highlight.end + 1;
        outerRight.text = text.substring(outerRight.start, endIndex + 1);
      }

      this.removeHighlightsByIndices(innerIndices);

      // TODO: highlights are not redrawn automatically if no highlights
      // have been added or removed; temporary explicit call added
      this.refreshEditorHighlights();
    },
    removeHighlightsByIndices(indices) {
      forEach(sortBy(indices, index => -index), index => {
        this.highlights.splice(index, 1);
      });
    },
    clearEditorHighlights() {
      const textLength = this.textEditor.getLength();
      this.textEditor.formatText(0, textLength, { highlight: false });
    },
    refreshEditorHighlights() {
      // TODO: each reformat triggers text-change and, in turn, update;
      // perform formatting in temp editor and set this.content to its innerHTML?
      this.clearEditorHighlights();
      forEach(this.highlights, h => {
        this.textEditor.formatText(h.start, h.text.length, { highlight: true });
      });
    }
  },
  watch: {
    isEditing(newVal) {
      if (!newVal) {
        // TODO: make text editor read-only when not in edit mode
        this.textEditor.disable();
        this.options = { modules: { toolbar: false } };
      } else {
        this.textEditor.enable();
      }
    },
    highlights() {
      this.refreshEditorHighlights();
    },
    content() {
      const text = this.getContent(false);
      forEachRight(this.highlights, (h, index) => {
        if (h.text !== text.substring(h.start, h.end + 1)) {
          this.highlights.splice(index, 1);
        }
      });
    }
  },
  created() {
    this.content = this.assessment.text;
    this.highlights = Highlight.fromPlainObjects(this.assessment.answers);
  },
  mounted() {
    this.textEditor.on('selection-change', this.onSelectionChanged);
    this.textEditor.on('text-change', (delta, oldContent, source) => {
      this.content = this.textEditor.root.innerHTML;
      // TODO: update seems to get triggered too frequently; investigate
      this.update();
    });
  },
  components: { QuillEditor }
};

function getRelatedHighlights(highlight, highlights) {
  const related = {
    innerIndices: [],
    outerIndices: [],
    outerLeft: null,
    outerRight: null,
    containing: null
  };

  forEach(highlights, (h, index) => {
    if (highlight.isContainedBy(h)) return (related.containing = h);

    if (highlight.contains(h)) return related.innerIndices.push(index);

    if (highlight.bordersFromLeft(h)) {
      related.outerLeft = h;
      return related.outerIndices.push(index);
    }

    if (highlight.bordersFromRight(h)) {
      related.outerRight = h;
      return related.outerIndices.push(index);
    }
  });

  return related;
}
</script>

<style lang="scss" scoped>
$highlightBackground: #144acc;
$highlightTextColor: #fff;

#answer-text {
  min-height: 120px;
}

.form-group {
  width: 100%;
  margin: 0 auto;
  padding: 25px 20px 15px;
  text-align: left;
  overflow: hidden;
}

.form-label {
  font-size: 20px;
}

.answer {
  margin: 10px 0;
  padding: 10px 0 0 50px;
  font-size: 16px;
}

.highlight {
  &-container {
    display: block;
    margin: 10px 0;
  }

  &-btn {
    padding: 5px 10px;
  }

  &-add {
    color: $highlightTextColor;
    background: $highlightBackground;
  }

  &-remove {
    color: #000;
    background: #b11;
  }
}

.quill-editor /deep/ .ql-highlight {
  color: $highlightTextColor;
  background: $highlightBackground;
}
</style>
