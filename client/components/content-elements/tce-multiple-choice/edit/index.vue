<template>
  <div class="py-4">
    <div class="mb-5 subtitle-2">{{ title }}</div>
    <v-text-field
      v-for="(answer, idx) in answers" :key="idx"
      @change="updateAnswer($event, idx)"
      :value="answer"
      :disabled="disabled"
      :error="answerError(idx)"
      :placeholder="placeholder"
      :class="['answer', { 'non-graded': !isGraded }]"
      filled>
      <template slot="prepend-inner">
        <v-checkbox
          v-if="isGraded"
          v-model="correct"
          :value="idx"
          :color="color"
          :disabled="disabled"
          :error="correctError"
          hide-details class="checkbox" />
        <v-avatar
          v-else
          size="26"
          color="blue-grey darken-3"
          class="mr-3 subtitle-2">
          {{ idx + 1 }}
        </v-avatar>
      </template>
      <template slot="append">
        <v-btn v-if="isEditing" @click="removeAnswer(idx)" small icon>
          <v-icon small>mdi-close</v-icon>
        </v-btn>
      </template>
    </v-text-field>
    <div class="d-flex mb-5">
      <v-spacer />
      <v-btn v-if="isEditing" @click="addAnswer" text class="px-2">
        <v-icon>mdi-plus</v-icon>
        Add option
      </v-btn>
    </div>
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep';
import { defaults } from 'utils/assessment';
import range from 'lodash/range';
import set from 'lodash/set';

const MIN_TWO_ANSWERS = {
  text: 'Please make at least two answers available!',
  type: 'error'
};

const getTitle = isGraded => isGraded ? 'Answers' : 'Options';
const getPlaceholder = isGraded => isGraded ? 'Answer...' : 'Option...';

export default {
  props: {
    assessment: { type: Object, default: defaults.MC },
    errors: { type: Array, default: () => ([]) },
    isEditing: { type: Boolean, default: false },
    isGraded: { type: Boolean, default: false }
  },
  computed: {
    correct: {
      get() { return this.assessment.correct; },
      set(index) { this.update({ correct: index }); }
    },
    disabled: vm => !vm.isEditing,
    answers: vm => vm.assessment.answers,
    feedback: vm => vm.assessment.feedback,
    color: vm => vm.disabled ? 'grey' : 'blue-grey darken-3',
    correctError: vm => vm.errors.includes('correct'),
    placeholder: vm => getPlaceholder(vm.isGraded),
    title: vm => getTitle(vm.isGraded)
  },
  methods: {
    addAnswer() {
      this.update({ answers: [...cloneDeep(this.answers), ''] });
    },
    updateAnswer(value, index) {
      this.update({ answers: set(cloneDeep(this.answers), index, value) });
    },
    removeAnswer(answerIndex) {
      const answers = cloneDeep(this.answers);
      const correct = cloneDeep(this.correct);
      const feedback = cloneDeep(this.feedback);

      answers.splice(answerIndex, 1);

      if (this.isGraded) {
        const index = correct.indexOf(answerIndex);
        if (index !== -1) correct.splice(index, 1);
        correct.forEach((it, i) => {
          if (it >= answerIndex) correct[i] = it - 1;
        });
        this.correct = correct;
      }

      if (feedback) {
        range(answerIndex, answers.length).forEach(it => {
          feedback[it] = feedback[it + 1];
        });
        delete feedback[answers.length];
      }

      this.update({ answers, correct, feedback });
    },
    validate() {
      this.$emit('alert', this.answers.length < 2 ? MIN_TWO_ANSWERS : {});
    },
    answerError(index) {
      return this.errors.includes(`answers[${index}]`);
    },
    update(data) {
      this.$emit('update', data);
    }
  },
  watch: {
    'assessment.answers'() { this.validate(); }
  }
};
</script>

<style lang="scss" scoped>
.answer {
  .checkbox {
    position: relative;
    left: 0.25rem;
    margin: 0;
    padding: 0;
  }

  .v-avatar {
    position: relative;
    bottom: 0.1rem;
    color: #fff;
  }
}
</style>
