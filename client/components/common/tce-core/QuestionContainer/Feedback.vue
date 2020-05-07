<template>
  <div>
    <div>
      <span class="subtitle-2">{{ title }}</span>
      <v-btn
        @click="toggleExpand"
        text small
        class="ml-1">
        {{ buttonLabel }}
      </v-btn>
    </div>
    <transition name="fade">
      <div v-if="isExpanded" class="feedback-content">
        <v-row v-for="(answer, i) in processedAnswers" :key="i">
          <v-col>
            <div class="feedback-info mb-4">
              <span class="answer-type subtitle-2">{{ answerType }} {{ i + 1 }}:</span>
              <span>{{ answer || noAnswer }}</span>
            </div>
            <quill-editor
              v-if="isEditing"
              @change="updateFeedback($event, i)"
              :options="quillOptions"
              :content="feedback[i]"
              class="grey lighten-3" />
            <div v-else class="feedback-preview">
              <!-- eslint-disable-next-line vue/no-v-html -->
              <div v-if="feedback[i]" v-html="feedback[i]"></div>
              <i v-else>{{ noFeedback }}</i>
            </div>
          </v-col>
        </v-row>
      </div>
    </transition>
  </div>
</template>

<script>
import isArray from 'lodash/isArray';
import { quillEditor as QuillEditor } from 'vue-quill-editor';
import some from 'lodash/some';

const TITLE = 'Feedback';
const NO_ANSWER = 'Answer not added.';
const NO_FEEDBACK = 'Feedback not added.';
const QUILL_OPTIONS = {
  modules: {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ script: 'sub' }, { script: 'super' }],
      [{ color: [] }, { background: [] }],
      ['link']
    ]
  }
};

const getAnswerType = isGraded => isGraded ? 'Answer' : 'Option';
const getButtonLabel = isExpanded => isExpanded ? 'hide' : 'show';

export default {
  name: 'feedback',
  props: {
    answers: { type: [Array, Boolean], default: null },
    feedback: { type: Object, default: () => ({}) },
    isEditing: { type: Boolean, default: false },
    isGraded: { type: Boolean, default: false }
  },
  data: vm => ({
    isExpanded: some(vm.feedback)
  }),
  computed: {
    title: () => TITLE,
    noAnswer: () => NO_ANSWER,
    noFeedback: () => NO_FEEDBACK,
    quillOptions: () => QUILL_OPTIONS,
    answerType: vm => getAnswerType(vm.isGraded),
    buttonLabel: vm => getButtonLabel(vm.isExpanded),
    processedAnswers: vm => isArray(vm.answers) ? vm.answers : ['True', 'False']
  },
  methods: {
    updateFeedback({ html }, index) {
      this.$emit('update', { [index]: html });
    },
    toggleExpand() {
      this.isExpanded = !this.isExpanded;
    }
  },
  watch: {
    isEditing(val) {
      if (!some(this.feedback)) return;
      if (val) this.isExpanded = true;
    }
  },
  components: { QuillEditor }
};
</script>
