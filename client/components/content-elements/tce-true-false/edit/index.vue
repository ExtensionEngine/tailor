<template>
  <div>
    <div class="subtitle-2">{{ title }}</div>
    <v-radio-group v-model="correct" :error="correctError">
      <v-radio
        v-for="(answer, index) in [true, false]"
        :key="index"
        :value="answer"
        :disabled="answerDisabled"
        :label="getLabel(answer)"
        :color="answerDisabled ? 'grey' : 'blue-grey darken-3'"
        :off-icon="isGraded ? 'mdi-circle-outline' : 'mdi-circle'"
        class="answer pl-3" />
    </v-radio-group>
  </div>
</template>

<script>
import { capital } from 'to-case';
import { defaults } from 'utils/assessment';

const getTitle = isGraded => isGraded ? 'Select correct answer' : 'Options';
const getLabel = answer => capital(answer.toString());

export default {
  props: {
    assessment: { type: Object, default: defaults.TF },
    errors: { type: Array, default: () => ([]) },
    isEditing: { type: Boolean, default: false },
    isGraded: { type: Boolean, default: false }
  },
  computed: {
    correct: {
      get() { return this.assessment.correct; },
      set(correct) { this.$emit('update', { correct }); }
    },
    title: vm => getTitle(vm.isGraded),
    answerDisabled: vm => !vm.isEditing || !vm.isGraded,
    correctError: vm => vm.errors.includes('correct')
  },
  methods: { getLabel }
};
</script>
