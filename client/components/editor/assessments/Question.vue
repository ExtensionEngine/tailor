<template>
  <div class="question-container">
    <h4>Question</h4>
    <div
      :class="{ editing: isEditing, 'question-error': questionError }"
      class="question">
      <asset
        v-for="asset in question"
        :asset="asset"
        :disabled="!isEditing">
      </asset>
      <select-asset v-show="isEditing" @selected="addAsset"></select-asset>
    </div>
    <span class="help-block" v-if="isEditing && helperText">
      {{ helperText }}
    </span>
  </div>
</template>

<script>
import Asset from '../assets';
import cuid from 'cuid';
import { helperText } from '../../../utils/assessment';
import { mapGetters } from 'vuex-module';
import SelectAsset from './SelectAsset';

const blankRegex = /(@blank)/g;

export default {
  props: {
    assessment: Object,
    isEditing: Boolean,
    errors: Array
  },
  data() {
    return {
      question: this.assessment.question,
      config: { modules: { toolbar: '#quillToolbar' } }
    };
  },
  computed: {
    ...mapGetters(['toolbar'], 'atom'),
    initialQuestion() {
      return this.assessment.question;
    },
    parsedQuestion() {
      let index = 0;
      return this.question.replace(blankRegex, () => `(${++index})__________`);
    },
    helperText() {
      const helper = helperText[this.assessment.type] || {};
      return helper.question;
    },
    isFocused() {
      const ctx = this.toolbar.context;
      return this.isEditing && (ctx && ctx._cid === this.assessment._cid);
    },
    questionError() {
      return this.errors.includes('question');
    }
  },
  methods: {
    update() {
      this.$emit('update', { question: this.question });
    },
    addAsset(type) {
      this.question.push({ cid: cuid(), type, embed: true });
    }
  },
  components: {
    Asset,
    SelectAsset
  },
  watch: {
    initialQuestion(newVal) {
      if (newVal !== this.question) this.question = newVal;
    }
  }
};
</script>

<style lang="scss" scoped>
.question-container {
  clear: both;
  width: 100%;
  text-align: left;
}

.question {
  font-size: 22px;
  border: 1px dashed transparent;
  text-align: center;
  padding: 10px;

  .message {
    padding: 13px;
  }

  &.editing {
    border-color: #ccc;
  }

  &.question-error {
    .ql-container, span {
      border-bottom: 0;
      box-shadow: inset 0 -2px 0 #e51c23;
    }
  }

  .well {
    margin: 0;
    padding: 29px;
  }
}
</style>
