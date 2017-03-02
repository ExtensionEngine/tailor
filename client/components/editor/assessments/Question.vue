<template>
  <div class="question-container">
    <h4>Question</h4>
    <div
      :class="{ editing: isEditing, 'question-error': questionError }"
      @click="focus"
      class="question">
      <div v-if="!isFocused && !question">
        <div class="well">
          <div class="message">
            <span>Click to edit</span>
          </div>
        </div>
      </div>
      <div v-else>
        <quill-editor
          v-if="isFocused"
          v-model="question"
          :config="config"
          @change="update">
        </quill-editor>
        <div v-else class="ql-container ql-snow">
          <div v-html="parsedQuestion" class="ql-editor"></div>
        </div>
      </div>
    </div>
    <span class="help-block" v-if="isEditing && helperText">
      {{ helperText }}
    </span>
  </div>
</template>

<script>
import { helperText } from '../../../utils/assessment';
import { mapGetters, mapMutations } from 'vuex-module';
import { quillEditor } from 'vue-quill-editor';

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
      const newValue = () => `(${++index})__________`;
      return this.question.replace(blankRegex, newValue);
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
    ...mapMutations(['setToolbarContext'], 'atom'),
    focus(e) {
      this.setToolbarContext({ type: 'ASSESSMENT', context: this.assessment });
      // Attach component meta to event
      e.component = {
        name: 'assessment',
        data: this.assessment
      };
    },
    update() {
      let data = { question: this.question };
      this.$emit('update', data);
    }
  },
  components: {
    quillEditor
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
    .ql-container,
    span {
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
