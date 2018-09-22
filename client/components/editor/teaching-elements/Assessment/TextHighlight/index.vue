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
        @contentChange="onContentChanged">
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
import HighlightCollection from './HighlightCollection';
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
      highlights: new HighlightCollection(),
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
      this.refreshEditorHighlights();

      this.$emit('update', {
        text: this.textEditor.getFormattedContent(),
        answers: this.highlights.toPlainObjects()
      });
    },
    onSelectionChanged(startIndex, selectedText) {
      // prevent current selection from obscuring the new highlight
      if (this.isHighlighting) this.textEditor.defocus();

      this.isHighlighting
        ? this.highlights.addHighlight(startIndex, selectedText)
        : this.highlights.removeHighlight(startIndex, selectedText);

      this.update();
    },
    onContentChanged() {
      this.highlights.updateForText(this.textEditor.getPlainContent());

      this.update();
    },
    refreshEditorHighlights() {
      const getData = h => ({ start: h.start, length: h.text.length });
      const highlights = this.highlights.toPlainObjects();
      this.textEditor.renderHighlights(highlights.map(h => getData(h)));
    }
  },
  created() {
    this.highlights = HighlightCollection.fromPlainObjects(this.answers);
  },
  mounted() {
    this.refreshEditorHighlights();
  },
  components: { TextEditor }
};
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
