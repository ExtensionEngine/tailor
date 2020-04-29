<template>
  <div>
    <div class="subtitle-2 pt-2">{{ title }}</div>
    <v-radio-group v-model="correct" :error="correctError">
      <v-radio
        v-for="(answer, index) in [true, false]"
        :key="index"
        :value="answer"
        :disabled="disabled"
        :label="getLabel(answer)"
        :color="disabled ? 'grey' : 'blue-grey darken-3'"
        :off-icon="isGraded ? 'mdi-circle-outline' : 'mdi-circle'"
        class="answer pl-3" />
    </v-radio-group>
  </div>
</template>

<script>
import { defaults } from 'utils/assessment';
import { sentence } from 'to-case';

const getTitle = isGraded => isGraded ? 'Select correct answer' : 'Options';
const getLabel = answer => sentence(answer.toString());

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
    disabled: vm => !vm.isEditing || !vm.isGraded,
    correctError: vm => vm.errors.includes('correct')
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
