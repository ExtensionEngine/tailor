<template>
  <div>
    <div class="subtitle-2">{{ title }}</div>
    <v-radio-group v-model="correct" :error-messages="correctErrors" class="mb-2">
      <v-radio
        v-for="(answer, index) in [true, false]"
        :key="index"
        :value="answer"
        :disabled="answerDisabled"
        :label="getLabel(answer)"
        :color="answerDisabled ? 'grey' : 'primary darken-3'"
        :off-icon="isGraded ? 'mdi-circle-outline' : 'mdi-circle'"
        class="answer pl-3" />
    </v-radio-group>
  </div>
</template>

<script>
import { assessment } from '@tailor-cms/utils';
import { capital } from 'to-case';

const getTitle = isGraded => isGraded ? 'Select correct answer' : 'Options';
const getLabel = answer => capital(answer.toString());

export default {
  props: {
    assessment: { type: Object, default: assessment.defaults.TF },
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
  },
  methods: { getLabel }
};
</script>
