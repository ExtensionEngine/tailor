<template>
  <div>
    <div class="text-subtitle-2">{{ title }}</div>
    <v-radio-group v-model="correct" :error="!!correctError" hide-details>
      <v-text-field
        v-for="(answer, idx) in answers" :key="idx"
        @change="updateAnswer($event, idx)"
        :value="answer"
        :error-messages="answerErrors(idx)"
        :placeholder="placeholder"
        :disabled="disabled"
        :color="color"
        filled>
        <template slot="prepend-inner">
          <v-radio
            v-if="isGraded"
            :value="idx"
            :disabled="disabled"
            :color="color" />
          <v-avatar v-else :color="color" size="24" class="text-subtitle-2 mr-2">
            {{ idx + 1 }}
          </v-avatar>
        </template>
        <template slot="append">
          <v-btn v-if="allowRemoval" @click="removeAnswer(idx)" small icon>
            <v-icon small>mdi-close</v-icon>
          </v-btn>
        </template>
      </v-text-field>
    </v-radio-group>
    <div
      :class="{ 'pb-2': isEditing }"
      class="d-flex justify-space-between align-center">
      <input-error :error="correctError" />
      <v-btn
        v-if="isEditing"
        @click="addAnswer"
        :color="color"
        text
        class="ml-auto px-2">
        <v-icon dense class="mr-1">mdi-plus</v-icon>
        {{ addButtonLabel }}
      </v-btn>
    </div>
  </div>
</template>

<script>
import { assessment } from '@tailor-cms/utils';
import cloneDeep from 'lodash/cloneDeep';
import head from 'lodash/head';
import { InputError } from '@tailor-cms/core-components';
import range from 'lodash/range';
import set from 'lodash/set';

const MIN_ANSWER_COUNT = 2;

const getTitle = isGraded => isGraded ? 'Select correct answer' : 'Options';
const getPlaceholder = isGraded => isGraded ? 'Answer...' : 'Option...';
const getButtonLabel = isGraded => isGraded ? 'Add answer' : 'Add option';

export default {
  name: 'tce-single-choice',
  props: {
    assessment: { type: Object, default: assessment.defaults.SC },
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
    title: vm => getTitle(vm.isGraded),
    placeholder: vm => getPlaceholder(vm.isGraded),
    addButtonLabel: vm => getButtonLabel(vm.isGraded),
    allowRemoval: vm => vm.isEditing && vm.answers.length > MIN_ANSWER_COUNT,
    correctError: vm => head(assessment.getErrorMessages(vm.errors, 'correct'))
  },
  methods: {
    addAnswer() {
      this.update({ answers: [...this.answers, ''] });
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
    answerErrors(idx) {
      return assessment.getErrorMessages(this.errors, `answers[${idx}]`);
    },
    update(data) {
      this.$emit('update', data);
    }
  },
  components: { InputError }
};
</script>

<style lang="scss" scoped>
.v-avatar {
  color: #fff;
}
</style>
