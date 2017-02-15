<template>
  <div>
    <div class="form-group">
      <span class="form-label">Answer</span>
      <span :class="{ 'has-error': errors.includes('correct') }" class="answer">
        <textarea
          v-model="correct"
          :disabled="!isEditing"
          @blur="update"
          class="form-control"
          rows="6"
          type="text">
        </textarea>
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
