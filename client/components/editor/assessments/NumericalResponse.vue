<template>
  <div class="form-group">
    <span class="form-label">Answer</span>
    <span :class="{ 'has-error': correctError }" class="answer">
      <input
        v-model="correct"
        :disabled="!isEditing"
        @blur="update"
        class="form-control">
        <span class="help-block">
          Only numerical input allowed, if decimal number is needed please
          use '.' to separate numbers (e.g. '3.14').
        </span>
    </span>
  </div>
</template>

<script>
export default {
  props: {
    assessment: Object,
    errors: Array,
    isEditing: Boolean
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
      let data = { correct: this.correct };
      this.$emit('update', data);
    }
  },
  watch: {
    isEditing(newVal) {
      if (!newVal) this.correct = this.assessment.correct;
    }
  }
};
</script>

<style lang="scss" scoped>
.form-group {
  text-align: left;
  margin: 0 auto;
  padding: 25px 20px 15px 20px;
  width: 100%;
  overflow: hidden;
}

.form-label {
  font-size: 20px;
}

.answer {
  padding: 10px 0 0 50px;
  font-size: 16px;
  margin: 10px 0;
}

input.form-control {
  padding-left: 10px;
}
</style>
