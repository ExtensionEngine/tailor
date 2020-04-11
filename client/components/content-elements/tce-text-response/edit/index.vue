<template>
  <div class="text-response">
    <span class="title">{{ title }}</span>
    <v-textarea
      v-model="correct"
      @blur="update"
      :disabled="disabled"
      :error="correctError"
      rows="6" class="mt-0" />
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
  data: vm => ({ correct: vm.assessment.correct }),
  computed: {
    disabled: vm => !vm.isEditing || !vm.isGraded,
    correctError: vm => vm.errors.includes('correct'),
    title: vm => getTitle(vm.isGraded)
  },
  methods: {
    update() {
      this.$emit('update', { correct: this.correct });
    }
  },
  watch: {
    isEditing(newVal) {
      if (this.isGraded && !newVal) this.correct = this.assessment.correct;
    }
  }
};
</script>

<style lang="scss" scoped>
.text-response {
  width: 100%;
  padding: 1.5rem 1.25rem 1rem;
  text-align: left;
  overflow: hidden;

  .title {
    font-weight: 400;
  }
}
</style>
