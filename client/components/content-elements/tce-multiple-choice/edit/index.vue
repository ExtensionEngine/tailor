<template>
  <div class="multiple-choice">
    <span class="title">{{ title }}</span>
    <v-btn
      @click="addAnswer"
      :disabled="disabled"
      small icon tile class="float-right">
      <v-icon small>mdi-plus</v-icon>
    </v-btn>
    <v-text-field
      v-for="(answer, idx) in answers" :key="idx"
      @change="updateAnswer($event, idx)"
      :value="answer"
      :disabled="disabled"
      :error="answerError(idx)"
      :placeholder="placeholder"
      :class="['answer', { 'non-graded': !isGraded }]"
      hide-details>
      <template slot="prepend">
        <v-checkbox
          v-if="isGraded"
          v-model="correct"
          @change="toggleAnswer(idx)"
          :value="idx"
          :color="color"
          :disabled="disabled"
          :error="correctError"
          hide-details class="checkbox" />
        <v-avatar v-else size="32" color="primary">{{ idx + 1 }}</v-avatar>
      </template>
      <template slot="append">
        <v-btn @click="removeAnswer(idx)" small icon tile class="remove">
          <v-icon small>mdi-close</v-icon>
        </v-btn>
      </template>
    </v-text-field>
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep';
import { defaults } from 'utils/assessment';
import range from 'lodash/range';
import set from 'lodash/set';

const customAlert = {
  type: 'alert-danger',
  text: 'Please make at least two answers available !'
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
  data: vm => ({ correct: vm.assessment.correct }),
  computed: {
    disabled: vm => !vm.isEditing,
    answers: vm => vm.assessment.answers,
    feedback: vm => vm.assessment.feedback,
    color: vm => vm.disabled ? 'grey' : 'blue darken-2',
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
      this.$emit('alert', this.answers.length < 2 ? customAlert : {});
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
.multiple-choice {
  width: 100%;
  padding: 1.5rem 1.25rem 1rem;
  text-align: left;
  overflow: hidden;

  .title {
    font-weight: 400;
  }

  .answer {
    margin-top: 0.5rem;
    padding-left: 3rem;

    .remove {
      display: none;
    }

    &:hover .remove {
      display: block;
    }

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

  .non-graded {
    padding-left: 1rem;
  }

  @media (max-width: 850px) {
    .answer, .non-graded {
      padding-left: 0;
    }
  }
}
</style>
