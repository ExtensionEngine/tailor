<template>
  <div>
    <div class="form-group">
      <span class="form-label">Select correct answer</span>
      <ul>
        <li>
          <span :class="{ 'has-error': errors.includes('correct') }">
            <input
              v-model="correct"
              :disabled="!isEditing"
              :value="true"
              @change="update"
              type="radio">
          </span>
          <span class="answers">True</span>
        </li>
        <li>
          <span :class="{ 'has-error': errors.includes('correct') }">
            <input
              v-model="correct"
              :disabled="!isEditing"
              :value="false"
              @change="update"
              type="radio">
          </span>
          <span class="answers">False</span>
        </li>
      </ul>
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
