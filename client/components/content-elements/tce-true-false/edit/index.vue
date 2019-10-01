<template>
  <div class="form-group">
    <span class="form-label">
      {{ isGraded ? 'Select correct  answer' : 'Options' }}
    </span>
    <v-radio-group
      v-model="correct"
      @change="update"
      :error="correctError"
      :disabled="disabled">
      <v-radio label="True" :value="true" />
      <v-radio label="False" :value="false" />
    </v-radio-group>
  </div>
</template>

<script>
import { defaults } from 'utils/assessment';

export default {
  props: {
    assessment: { type: Object, default: defaults.TF },
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
    },
    disabled() {
      return !this.isEditing || !this.isGraded;
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

.v-input--radio-group {
  padding: 24px 0 0 50px;
}
</style>
