<template>
  <div>
    <div class="form-group">
      <span class="form-label">Answers</span>
      <button
        :disabled="!isEditing"
        @click="addAnswer"
        class="btn btn-default answers-add"
        type="button">
        <span class="fa fa-plus"></span>
      </button>
      <ul>
        <li v-for="(answer, index) in answers">
          <span
            :class="{ 'error': errors.includes('correct') }"
            class="answers-checkbox">
            <input
              v-model="correct"
              :value="index"
              :disabled="!isEditing"
              @change="update"
              type="checkbox">
          </span>
          <span
            :class="{ 'has-error': errors.includes(`answers[${index}]`) }"
            class="answers-input">
            <input
              v-model="answers[index]"
              :disabled="!isEditing"
              @blur="update"
              type="text"
              placeholder="Answer">
          </span>
          <button
            :disabled="!isEditing"
            @click="removeAnswer(index)"
            class="destroy"
            type="button">
            <span class="fa fa-times"></span>
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
const customAlert = {
  text: 'Please make at least three answers available !',
  type: 'alert-danger'
};

export default {
  props: {
    assessment: Object,
    errors: Array,
    isEditing: Boolean
  },
  data() {
    return {
      answers: this.assessment.answers,
      correct: this.assessment.correct
    };
  },
  methods: {
    addAnswer() {
      this.answers.push('');
      this.update();
    },
    removeAnswer(index) {
      this.answers.splice(index, 1);

      if (this.correct.indexOf(index) !== -1) {
        this.correct.splice(this.correct.indexOf(index), 1);
      }

      this.correct.forEach((item, i) => {
        if (item >= index) this.correct[i] = item - 1;
      });

      this.update();
    },
    validate() {
      if (this.answers.length < 3) this.$emit('alert', customAlert);
      else this.$emit('alert');
    },
    update() {
      let data = {
        answers: this.answers,
        correct: this.correct
      };
      this.$emit('update', data);
      this.validate();
    }
  },
  watch: {
    isEditing: function(newVal) {
      if (!newVal) {
        this.answers = this.assessment.answers;
        this.correct = this.assessment.correct;
      }
    }
  }
};
</script>

<style lang="scss"></style>
