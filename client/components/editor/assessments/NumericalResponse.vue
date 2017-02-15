<template>
  <div>
    <div class="form-group">
      <span class="form-label">Answer</span>
      <span
        :class="{ 'has-error': errors.includes('correct') }"
        class="answer">
        <input
          v-model="correct"
          :disabled="!isEditing"
          @blur="update"
          class="form-control">
          <span class="help-block" type="text">
            Only numerical input allowed, if decimal number is needed please
            use '.' to separate numbers (e.g. '3.14').
          </span>
      </span>
    </div>
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
  methods: {
    update() {
      let data = { correct: this.correct };
      this.$emit('update', data);
    }
  },
  watch: {
    isEditing: function(newVal) {
      if (!newVal) this.correct = this.assessment.correct;
    }
  }
};
</script>

<style lang="scss"></style>
