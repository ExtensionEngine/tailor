<template>
  <div class="true-false">
    <span class="title">{{ title }}</span>
    <v-radio-group v-model="correct" @change="update" :error="correctError">
      <v-radio
        v-for="(answer, idx) in [true, false]"
        :key="idx"
        :value="answer"
        :disabled="disabled"
        :label="getLabel(answer)"
        :color="disabled ? 'grey' : 'blue darken-2'"
        :off-icon="isGraded ? 'mdi-circle-outline' : 'mdi-circle'"
        :class="['answer', {'non-graded': !isGraded }]" />
    </v-radio-group>
  </div>
</template>

<script>
import { defaults } from 'utils/assessment';
import { sentence } from 'to-case';

const getTitle = isGraded => isGraded ? 'Select correct  answer' : 'Options';
const getLabel = answer => sentence(answer.toString());

export default {
  props: {
    assessment: { type: Object, default: defaults.TF },
    errors: { type: Array, default: () => ([]) },
    isEditing: { type: Boolean, default: false },
    isGraded: { type: Boolean, default: false }
  },
  data: vm => ({ correct: vm.assessment.correct }),
  computed: {
    title: vm => getTitle(vm.isGraded),
    disabled: vm => !vm.isEditing || !vm.isGraded,
    correctError: vm => vm.errors.includes('correct')
  },
  methods: {
    update(correct) {
      this.$emit('update', { correct });
    },
    getLabel
  },
  watch: {
    isEditing(newVal) {
      if (this.isGraded && !newVal) this.correct = this.assessment.correct;
    }
  }
};
</script>

<style lang="scss" scoped>
.true-false {
  text-align: left;
  overflow: hidden;

  .title {
    font-weight: 400;
  }

  .answer {
    padding: 0.25rem 3rem;

    // override global bootstrap
    ::v-deep .v-label {
      margin-bottom: 0;
    }
  }

  .non-graded {
    padding-left: 1rem;
  }

  @media (max-width: 850px) {
    .answer, .non-graded {
      padding-left: 0;
    }
  }
}
</style>
