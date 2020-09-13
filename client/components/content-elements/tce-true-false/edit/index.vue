<template>
  <div>
    <div class="subtitle-2">{{ title }}</div>
    <validation-provider v-slot="{ invalid }" name="correct" rules="required">
      <v-radio-group v-model="correct" :error="invalid">
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
    </validation-provider>
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
    isEditing: { type: Boolean, default: false },
    isGraded: { type: Boolean, default: false }
  },
  computed: {
    correct: {
      get() { return this.assessment.correct; },
      set(correct) { this.$emit('update', { correct }); }
    },
    title: vm => getTitle(vm.isGraded),
    answerDisabled: vm => !vm.isEditing || !vm.isGraded
  },
  methods: { getLabel }
};
</script>

<style lang="scss" scoped>
// override global bootstrap
.answer ::v-deep .v-label {
  margin-bottom: 0;
}
</style>
