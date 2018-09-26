<template>
  <div class="form-group">
    <span class="form-label">Answer</span>
    <span :class="{ 'has-error': hasErrors }" class="answer">
      <text-editor
        ref="textEditor"
        :text="text"
        :answers="answers"
        :highlightWildcards="wildcards"
        :enabled="isEditing"
        @change="update">
      </text-editor>
      <div v-if="isEditing">
        <div v-if="answers.length" class="highlighted">
          <span class="instructions-title">Highlights:</span>
          <span
            v-for="(highlight, index) in answers"
            :key="index"
            @click="removeHighlight(highlight)"
            class="item">
            {{ highlight.text }}
          </span>
          (click on an item to remove it from the list)
        </div>
        <div>
          <span class="instructions-title">Add a wildcard:</span>
          <input ref="wildcardInput" type="text"/>
          <button
            @click="addWildcard($refs.wildcardInput.value)"
            type="button"
            class="btn btn-default btn-material">
            Add
          </button>
        </div>
        <div v-if="wildcards.length" class="highlighted">
          <span class="instructions-title">Wildcards:</span>
          <span
            v-for="(wildcard, index) in wildcards"
            :key="index"
            @click="removeWildcard(wildcard)"
            class="item">
            {{ wildcard }}
          </span>
          (click on an item to remove it from the list)
        </div>
      </div>
    </span>
    <span v-if="errors.includes('answers')" class="error-message">
      Please add at least one correct answer by highlighting a text snippet or choosing a wildcard.
    </span>
  </div>
</template>

<script>
import { defaults } from 'utils/assessment';
import filter from 'lodash/filter';
import indexOf from 'lodash/indexOf';
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
      wildcards: []
    };
  },
  computed: {
    text() {
      return this.assessment.text;
    },
    answers() {
      return filter(this.assessment.answers, h => h.start !== -1);
    },
    hasErrors() {
      return this.errors.length > 0;
    },
    textEditor() {
      return this.$refs.textEditor;
    }
  },
  methods: {
    update() {
      const text = this.textEditor.getText();
      const answers = this.textEditor.getAnswers();
      const wildcards = this.wildcards.map(w => ({ start: -1, text: w }));

      this.$emit('update', { text, answers: answers.concat(wildcards) });
    },
    removeHighlight(highlight) {
      this.textEditor.removeHighlight(highlight);
    },
    addWildcard(text) {
      if (!text.length) return;
      if (!this.wildcards.includes(text)) this.wildcards.push(text);
      this.$refs.wildcardInput.value = '';
    },
    removeWildcard(text) {
      const index = indexOf(this.wildcards, text);
      if (index !== -1) this.wildcards.splice(index, 1);
    }
  },
  watch: {
    wildcards() {
      this.update();
    }
  },
  created() {
    const wildcards = filter(this.assessment.answers, h => h.start === -1);
    this.wildcards = wildcards.map(w => w.text);
  },
  components: { TextEditor }
};
</script>

<style lang="scss" scoped>
$highlightBackground: #2f73e9;
$highlightTextColor: #fff;
$error: #d9534f;

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

.btn {
  padding: 5px;
  background: #aaa;
}

.highlighted {
  margin-top: 10px;

  .item {
    display: inline-block;
    border-radius: 5px;
    margin-right: 5px;
    margin-bottom: 5px;
    padding: 0 5px;
    color: $highlightTextColor;
    font-size: smaller;
    background: $highlightBackground;
    cursor: pointer;
  }
}

.instructions-title {
  margin-top: 5px;
  font-weight: 600;
}

.has-error .quill-editor {
  border: 1px solid $error;
}

.error-message {
  display: block;
  color: $error;
  font-weight: bold;
  text-align: center;
}
</style>
