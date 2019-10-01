<template>
  <div class="tce-text-response">
    <span class="title">{{ isGraded ? 'Answer' : 'Response' }}</span>
    <v-textarea
      v-model="correct"
      @blur="update"
      :disabled="!isEditing || !isGraded"
      :error="correctError"
      rows="6" />
  </div>
</template>

<script>
import { defaults } from 'utils/assessment';

export default {
  props: {
    assessment: { type: Object, default: defaults.TR },
    isGraded: { type: Boolean, default: false },
    errors: { type: Array, default: () => ([]) },
    isEditing: { type: Boolean, default: false }
  },
  data() {
    return {
      correct: this.assessment.correct
    };
  },
  computed: {
    correctError() {
      return this.errors.includes('correct');
    }
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
.tce-text-response {
  padding: 25px 20px 15px;
  text-align: left;
}
</style>
