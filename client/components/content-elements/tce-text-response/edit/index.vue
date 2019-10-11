<template>
  <div class="form-group">
    <span class="form-label">{{ isGraded ? 'Answer' : 'Response' }}</span>
    <span :class="{ 'has-error': correctError }" class="answer">
      <textarea
        v-model="correct"
        @blur="update"
        :disabled="!isEditing || !isGraded"
        class="form-control"
        rows="6"
        type="text">
      </textarea>
    </span>
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
.form-group {
  width: 100%;
  margin: 0 auto;
  padding: 25px 20px 15px;
  text-align: left;
  overflow: hidden;
}

.form-label {
  font-size: 20px;
}

.answer {
  margin: 10px 0;
  padding: 10px 0 0 50px;
  font-size: 16px;
}
</style>
