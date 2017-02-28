<template>
  <div :class="{ 'disabled': disabled }">
    <h5>Answers</h5>
    <span @click="addAnswer" class="btn btn-link fa fa-plus pull-right"></span>
    <ul>
      <li v-for="(answer, index) in answers">
        <span :class="{ 'has-error': !hasCorrectAnswers }">
          <input
            v-model="correct"
            :value="index"
            :disabled="disabled"
            @change="update"
            type="checkbox">
        </span>
        <span :class="errorClass(index)">
          <input
            v-model="answers[index]"
            :disabled="disabled"
            @blur="update"
            class="form-control"
            placeholder="Answer...">
        </span>
        <span @click="removeAnswer(index)" class="fa fa-times control"></span>
      </li>
    </ul>
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
  computed: {
    hasCorrectAnswers() {
      return !this.errors.includes('correct');
    },
    disabled() {
      return !this.isEditing;
    }
  },
  methods: {
    update() {
      this.validate();
      this.$emit('update', { answers: this.answers, correct: this.correct });
    },
    addAnswer() {
      this.answers.push('');
      this.update();
    },
    removeAnswer(answerIndex) {
      this.answers.splice(answerIndex, 1);

      const index = this.correct.indexOf(answerIndex);
      if (index !== -1) this.correct.splice(index, 1);
      this.correct.forEach((it, i) => {
        if (it >= answerIndex) this.correct[i] = it - 1;
      });

      this.update();
    },
    validate() {
      this.$emit('alert', this.answers.length < 3 ? customAlert : {});
    },
    errorClass(index) {
      return {
        'has-error': this.errors.includes(`answers[${index}]`)
      };
    }
  },
  watch: {
    isEditing(newVal) {
      if (newVal) return;
      this.answers = this.assessment.answers;
      this.correct = this.assessment.correct;
    }
  }
};
</script>

<style lang="scss" scoped>
h5 {
  display: block;
  margin: 30px 0 10px 0;
  font-size: 18px;
  text-align: left;
}

ul {
  clear: both;
  padding: 5px 0 0 10px;
  list-style: none;

  li {
    position: relative;
    margin: 20px 0;
    padding-left: 40px;

    .form-control {
      padding-left: 10px;
    }

    input[type=checkbox]{
      position: absolute;
      left: 0;
      top: 5px;
    }
  }

  .fa-times {
    position: absolute;
    right: 5px;
    bottom: 5px;
    padding: 5px;
    cursor: pointer;
    color: #888;

    &:hover {
      color: darken(#888, 20%);
    }
  }
}

.has-error {
  input[type="checkbox"]:after {
    border-color: #d9534f;
  }

  input[type="checkbox"]:checked:after  {
    border-color: #337ab7;
  }
}

.disabled {
  pointer-events: none;

  .control, .btn {
    opacity: 0;
  }
}
</style>
