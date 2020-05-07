<template>
  <div>
    <div class="subtitle-2">{{ title }}</div>
    <v-radio-group v-model="correct" :error="correctError" hide-details>
      <v-text-field
        v-for="(answer, idx) in answers" :key="idx"
        @change="updateAnswer($event, idx)"
        :value="answer"
        :color="color"
        :disabled="disabled"
        :error="answerError(idx)"
        :placeholder="placeholder"
        filled>
        <template slot="prepend-inner">
          <v-radio v-if="isGraded" :value="idx" :color="color" />
          <v-avatar v-else size="24" :color="color" class="subtitle-2 mr-2">
            {{ idx + 1 }}
          </v-avatar>
        </template>
        <template slot="append">
          <v-btn v-if="isEditing" @click="removeAnswer(idx)" small icon>
            <v-icon small>mdi-close</v-icon>
          </v-btn>
        </template>
      </v-text-field>
    </v-radio-group>
    <div :class="['d-flex', 'justify-end', { 'pb-2': isEditing }]">
      <v-btn
        v-if="isEditing"
        @click="addAnswer"
        :color="color"
        text class="px-2">
        <v-icon dense class="mr-1">mdi-plus</v-icon>
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

const MIN_TWO_ANSWERS = {
  text: 'Please make at least two answers available!',
  type: 'error'
};

const getTitle = isGraded => isGraded ? 'Select correct answer' : 'Options';
const getPlaceholder = isGraded => isGraded ? 'Answer...' : 'Option...';
const getButtonLabel = isGraded => isGraded ? 'Add answer' : 'Add option';

export default {
  props: {
    assessment: { type: Object, default: defaults.SC },
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
    addButtonLabel: vm => getButtonLabel(vm.isGraded),
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
.v-avatar {
  color: #fff;
}
</style>
