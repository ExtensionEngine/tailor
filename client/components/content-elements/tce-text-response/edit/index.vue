<template>
  <div>
    <div class="subtitle-2 pb-4">{{ title }}</div>
    <v-textarea
      @change="correct = $event"
      :value="correct"
      :disabled="answerDisabled"
      :error-messages="correctErrors"
      color="blue-grey darken-3"
      filled clearable auto-grow />
  </div>
</template>

<script>
import { defaults, getErrorMessages } from 'utils/assessment';

const getTitle = isGraded => isGraded ? 'Answer' : 'Response';

export default {
  props: {
    assessment: { type: Object, default: defaults.TR },
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
    correctErrors: vm => getErrorMessages(vm.errors, 'correct')
  }
};
</script>
