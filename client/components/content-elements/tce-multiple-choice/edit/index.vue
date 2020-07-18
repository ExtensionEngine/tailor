<template>
  <div>
    <div class="subtitle-2 pb-4">{{ title }}</div>
    <v-text-field
      v-for="(answer, idx) in answers" :key="idx"
      @change="updateAnswer($event, idx)"
      :value="answer"
      :error="answerError(idx)"
      :disabled="disabled"
      :color="color"
      :placeholder="placeholder"
      filled>
      <template slot="prepend-inner">
        <v-checkbox
          v-if="isGraded"
          v-model="correct"
          :value="idx"
          :error="correctError"
          :disabled="disabled"
          :color="color"
          hide-details
          class="pt-0 mt-0" />
        <v-avatar v-else :color="color" size="24" class="subtitle-2 mr-2">
          {{ idx + 1 }}
        </v-avatar>
      </template>
      <template slot="append">
        <v-btn v-if="isEditing" @click="removeAnswer(idx)" small icon>
          <v-icon small>mdi-close</v-icon>
        </v-btn>
      </template>
    </v-text-field>
    <div :class="['d-flex', 'justify-end', { 'pb-2': isEditing }]">
      <v-btn
        v-if="isEditing"
        @click="addAnswer"
        :color="color"
        text
        class="px-2">
        <v-icon>mdi-plus</v-icon>
        {{ addButtonLabel }}
      </v-btn>
    </div>
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep';
import { defaults } from 'utils/assessment';
import range from 'lodash/range';
import set from 'lodash/set';

const MIN_ANSWER_ALERT = {
  type: 'error',
  text: 'Please make at least two answers available!'
};

const getTitle = isGraded => isGraded ? 'Select correct answer(s)' : 'Options';
const getPlaceholder = isGraded => isGraded ? 'Answer...' : 'Option...';
const getButtonLabel = isGraded => isGraded ? 'Add answer' : 'Add option';

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
    color: vm => vm.disabled ? 'grey' : 'grey darken-3',
    correctError: vm => vm.errors.includes('correct'),
    title: vm => getTitle(vm.isGraded),
    placeholder: vm => getPlaceholder(vm.isGraded),
    addButtonLabel: vm => getButtonLabel(vm.isGraded)
  },
  methods: {
    addAnswer() {
      this.update({ answers: [...this.answers, ''] });
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
      this.$emit('alert', this.answers.length < 2 ? MIN_ANSWER_ALERT : {});
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
.v-avatar {
  color: #fff;
}
</style>
