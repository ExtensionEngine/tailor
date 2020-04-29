<template>
  <div>
    <div class="py-3 subtitle-2">{{ title }}</div>
    <v-textarea
      @change="correct = $event"
      :value="correct"
      :disabled="disabled"
      :error="correctError"
      filled clearable />
  </div>
</template>

<script>
import { defaults } from 'utils/assessment';

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
    disabled: vm => !vm.isEditing || !vm.isGraded,
    correctError: vm => vm.errors.includes('correct')
  }
};
</script>
