<template>
  <div>
    <span class="title">{{ title }}</span>
    <v-btn
      v-if="isEditing"
      @click="addAnswer"
      small icon class="float-right">
      <v-icon small>mdi-plus</v-icon>
    </v-btn>
    <v-radio-group
      v-model="correct"
      @change="selectAnswer"
      :error="correctError"
      :class="['answers', {'non-graded': !isGraded }]">
      <v-text-field
        v-for="(answer, idx) in answers" :key="idx"
        @change="updateAnswer($event, idx)"
        :value="answer"
        :disabled="disabled"
        :error="answerError(idx)"
        :placeholder="placeholder"
        hide-details class="mb-2">
        <template slot="prepend">
          <v-radio v-if="isGraded" :value="idx" :color="color" />
          <v-avatar v-else size="32" color="primary" class="">{{ idx + 1 }}</v-avatar>
        </template>
        <template slot="append">
          <v-btn v-if="isEditing" @click="removeAnswer(idx)" small icon>
            <v-icon small>mdi-close</v-icon>
          </v-btn>
        </template>
      </v-text-field>
    </v-radio-group>
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
    assessment: { type: Object, default: defaults.SC },
    errors: { type: Array, default: () => ([]) },
    isEditing: { type: Boolean, default: false },
    isGraded: { type: Boolean, default: false }
  },
  data: vm => ({ correct: vm.assessment.correct }),
  computed: {
    disabled: vm => !vm.isEditing,
    answers: vm => vm.assessment.answers,
    feedback: vm => vm.assessment.feedback,
    color: vm => vm.disabled ? 'grey' : 'primary',
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
    removeAnswer(index) {
      let { correct } = this;
      const answers = cloneDeep(this.answers);
      const feedback = cloneDeep(this.feedback);

      answers.splice(index, 1);

      if (this.isGraded) {
        if (correct === index) correct = null;
        if (correct && correct >= index) correct -= 1;
        this.correct = correct;
      }

      if (feedback) {
        range(index, answers.length).forEach(it => {
          feedback[it] = feedback[it + 1];
        });
        delete feedback[answers.length];
      }
      this.$emit('update', { answers, correct, feedback });
    },
    selectAnswer(index) {
      this.update({ correct: index });
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
.answers {
  margin-left: 3rem;

  @media (max-width: 1263px) {
    margin-left: 0.25rem;
  }

  .v-radio {
    position: relative;
    left: 0.4rem;
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
</style>
