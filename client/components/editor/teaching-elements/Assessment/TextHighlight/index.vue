<template>
  <div class="form-group">
    <span class="form-label">Answer</span>
    <span :class="{ 'has-error': correctError }" class="answer">
      <span class="highlight-container">
        <!-- TODO: remove button, add 'highlight' option to toolbar instead -->
        <div v-if="isEditing">
          <button
            :class="isHighlighting ? 'highlight-add' : 'highlight-remove'"
            @click="isHighlighting = !isHighlighting"
            class="highlight-btn"
            type="button">
            <span class="icon mdi mdi-pencil"></span>
          </button>
          Highlighting mode: {{ isHighlighting ? 'ADD' : 'SUBTRACT' }}
        </div>
      </span>
      <text-editor
        ref="textEditor"
        :text="text"
        :enabled="isEditing"
        @selectionChange="onSelectionChanged"
        @contentChange="update">
      </text-editor>
      <div v-if="isEditing && highlights.length" class="highlighted">
        Highlights (click on an item to remove it from the list):
        <span
          v-for="(highlight, index) in highlights"
          :key="index"
          @click="removeHighlight(highlight)">
          {{ highlight.text }}
        </span>
      </div>
    </span>
  </div>
</template>

<script>
import { defaults } from 'utils/assessment';
import findIndex from 'lodash/findIndex';
import forEach from 'lodash/forEach';
import forEachRight from 'lodash/forEachRight';
import Highlight from './Highlight';
import isEmpty from 'lodash/isEmpty';
import sortBy from 'lodash/sortBy';
import TextEditor from './TextEditor';

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
    text() {
      return this.assessment.text;
    },
    answers() {
      return this.assessment.answers;
    },
    correctError() {
      return this.errors.includes('correct');
    },
    textEditor() {
      return this.$refs.textEditor;
    }
  },
  methods: {
    update() {
      this.$emit('update', {
        text: this.textEditor.getFormattedContent(),
        answers: Highlight.toPlainObjects(this.highlights)
      });
    },
    onSelectionChanged(startIndex, selectedText) {
      // prevent current selection from obscuring the new highlight
      if (this.isHighlighting) this.textEditor.defocus();

      const h = new Highlight(startIndex, selectedText);
      this.isHighlighting ? this.addHighlight(h) : this.removeHighlight(h);
      this.highlights = sortBy(this.highlights, h => h.start);
      this.update();
    },
    getText(startIndex, endIndex) {
      return this.textEditor.getPlainContent(startIndex, endIndex);
    },
    addHighlight(highlight) {
      // TODO: simplify code and/or extract parts of it into a helper
      const existingIndex = findIndex(this.highlights, highlight);
      if (existingIndex !== -1) return;

      const { inner, outer, containing } = getNearby(highlight, this.highlights);

      if (containing) return;

      if (isEmpty(inner) && isEmpty(outer)) {
        return this.highlights.push(highlight);
      }

      const { left, right } = outer;

      if (left && left.start < highlight.start) {
        const endIndex = highlight.end;
        highlight.start = left.start;
        highlight.text = this.getText(highlight.start, endIndex);
      }

      if (right && right.end > highlight.end) {
        highlight.text = this.getText(highlight.start, right.end);
      }

      const outerHighlights = isEmpty(outer) ? [] : outer.values();
      this.removeHighlights(inner.concat(outerHighlights));
      this.highlights.push(highlight);
    },
    removeHighlight(highlight) {
      // TODO: simplify code and/or extract parts of it into a helper
      const existingIndex = findIndex(this.highlights, highlight);
      if (existingIndex !== -1) return this.highlights.splice(existingIndex, 1);

      const { inner, outer, containing } = getNearby(highlight, this.highlights);

      if (containing) {
        const endIndex = containing.end;
        containing.text = this.getText(containing.start, highlight.start - 1);
        highlight.start = highlight.end + 1;
        highlight.text = this.getText(highlight.start, endIndex);

        return this.highlights.push(highlight);
      }

      if (isEmpty(inner) && isEmpty(outer)) return;

      const { left, right } = outer;

      if (left && left.end >= highlight.start) {
        left.text = this.getText(left.start, highlight.start - 1);
      }

      if (right && right.start <= highlight.end) {
        const endIndex = right.end;
        right.start = highlight.end + 1;
        right.text = this.getText(right.start, endIndex);
      }

      this.removeHighlights(inner);

      // TODO: highlights are not redrawn automatically if no highlights
      // have been added or removed; temporary explicit call added
      this.refreshEditorHighlights();
    },
    removeHighlights(highlights) {
      forEach(highlights, h => this.removeHighlight(h));
    },
    refreshEditorHighlights() {
      const getData = h => ({ start: h.start, length: h.text.length });
      this.textEditor.renderHighlights(this.highlights.map(h => getData(h)));
    }
  },
  watch: {
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
    this.highlights = Highlight.fromPlainObjects(this.answers);
  },
  components: { TextEditor }
};

function getNearby(highlight, highlights) {
  const related = {
    inner: [],
    outer: {},
    containing: null
  };

  forEach(highlights, h => {
    if (highlight.isContainedBy(h)) return (related.containing = h);
    if (highlight.contains(h)) return related.inner.push(h);
    if (highlight.bordersFromLeft(h)) related.outer.left = h;
    if (highlight.bordersFromRight(h)) related.outer.right = h;
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

.highlighted {
  margin-top: 10px;

  span {
    display: inline-block;
    border-radius: 5px;
    margin-right: 5px;
    margin-bottom: 5px;
    padding: 0 5px;
    color: $highlightTextColor;
    font-size: smaller;
    background: $highlightBackground;
  }
}
</style>
