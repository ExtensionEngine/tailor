<template>
  <div class="form-group">
    <span class="form-label">
      Question
    </span>
    <div
      @click="focus"
      class="question"
      :class="{ editing: isEditing }">
      <div v-if="!isFocused && !question">
        <div class="well text-placeholder">
          <div class="message">
            <span :class="{ 'error': questionError }">
              Click to edit
            </span>
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
        <div
          v-else
          class="ql-container ql-snow">
          <div
            v-html="question"
            class="ql-editor">
          </div>
        </div>
      </div>
    </div>
    <span class="help-block" v-if="isEditing">
        {{ helperText }}
    </span>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex-module';
import { quillEditor } from 'vue-quill-editor';
import { helperText } from '../../../utils/assessment';

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
    initQuestion() { // rename?
      return this.assessment.question;
    },
    helperText() {
      const helper = helperText[this.assessment.type] || {};
      return helper.question;
    },
    ...mapGetters(['toolbar']),
    isFocused() {
      return this.isEditing && (this.toolbar.context._cid === this.assessment._cid);
    },
    questionError() {
      return this.errors.includes('question');
    }
  },
  methods: {
    ...mapMutations(['setToolbarContext']),
    focus(e) {
      this.setToolbarContext(this.assessment);
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
    initQuestion: function(newVal) {
      if (newVal !== this.question) this.question = newVal;
    }
  }
};
</script>

<style lang="scss">
.assessment .question {
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

  .well {
    margin: 0;
    padding: 29px;
  }
}
</style>
