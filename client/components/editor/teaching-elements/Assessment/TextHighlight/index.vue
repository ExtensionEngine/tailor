<template>
  <div @click.stop="spawnToolbar" class="form-group">
    <span class="form-label">Answer</span>
    <span :class="{ 'has-error': hasErrors }" class="answer">
      <text-editor
        ref="textEditor"
        :text="assessment.text"
        :answers="answerHighlights"
        :wildcards="wildcardHighlights"
        :enabled="isEditing && isFocused"
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
        <div v-if="wildcardKeywords.length" class="highlighted">
          <span class="instructions-title">Wildcards:</span>
          <span
            v-for="(wildcard, index) in wildcardKeywords"
            :key="index"
            @click="removeWildcard(wildcard)"
            class="item">
            {{ wildcard }}
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
import Highlight from './Highlight';
import Highlights from './Highlights';
import { getPlainContent } from './helpers';
import { mapGetters, mapMutations } from 'vuex-module';
import TextEditor from './TextEditor';
import Wildcards from './Wildcards';

const isWildcard = object => Highlight.isWildcardObject(object);

export default {
  name: 'text-highlight',
  props: {
    assessment: { type: Object, default: defaults.TH },
    errors: { type: Array, default: () => ([]) },
    isEditing: { type: Boolean, default: false }
  },
  data() {
    const wildcards = filter(this.assessment.answers, it => isWildcard(it));
    return {
      wildcards: new Wildcards(wildcards.map(it => it.text), this.getText())
    };
  },
  computed: {
    answers() {
      return filter(this.assessment.answers, it => !isWildcard(it));
    },
    answerHighlights() {
      return Highlights.fromPlainObjects(this.answers);
    },
    hasErrors() {
      return this.errors.length > 0;
    },
    textEditor() {
      return this.$refs.textEditor;
    },
    isFocused() {
      const focused = this.focusedElement();
      if (!focused.type) return false;
      return focused._cid === this.$parent.element._cid;
    },
    wildcardKeywords() {
      return this.wildcards.getKeywords();
    },
    wildcardHighlights() {
      return this.wildcards.getHighlights();
    }
  },
  methods: {
    ...mapMutations(['focusElement'], 'editor'),
    ...mapGetters(['focusedElement'], 'editor'),
    update() {
      const text = this.textEditor.getText();
      const answers = this.textEditor.getAnswers().toPlainObjects();
      const wildcards = this.wildcards.toPlainObjects();

      this.$emit('update', { text, answers: answers.concat(wildcards) });
    },
    getText() {
      return getPlainContent(this.assessment.text);
    },
    removeHighlight(highlight) {
      if (!this.isFocused) return;
      this.textEditor.removeHighlight(highlight);
    },
    addWildcard(text) {
      if (!this.isFocused || !text.length) return;
      this.wildcards.addWildcard(text, this.getText());
      this.$refs.wildcardInput.value = '';
    },
    removeWildcard(text) {
      if (!this.isFocused) return;
      this.wildcards.removeWildcard(text, this.getText());
    },
    spawnToolbar() {
      if (this.isEditing) this.focusElement(this.$parent.element);
    }
  },
  watch: {
    wildcards() {
      this.update();
    }
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
