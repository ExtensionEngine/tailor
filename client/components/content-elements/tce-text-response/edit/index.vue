<template>
  <div>
    <div class="text-subtitle-2 pb-4">{{ title }}</div>
    <v-textarea
      @change="correct = $event"
      :value="correct"
      :disabled="answerDisabled"
      :error-messages="correctErrors"
      color="primary darken-3"
      filled clearable auto-grow />
  </div>
</template>

<script>
import { assessment } from '@tailor-cms/utils';

const getTitle = isGraded => isGraded ? 'Answer' : 'Response';

export default {
  name: 'tce-text-response',
  props: {
    assessment: { type: Object, default: assessment.defaults.TR },
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
    correctErrors: vm => assessment.getErrorMessages(vm.errors, 'correct')
  }
};
</script>
