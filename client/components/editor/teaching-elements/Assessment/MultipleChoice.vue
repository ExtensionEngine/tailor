<template>
  <div :class="{ disabled }">
    <h5>Answers</h5>
    <span @click="addAnswer" class="btn btn-link mdi mdi-plus pull-right"></span>
    <ul>
      <li v-for="(answer, index) in answers">
        <span :class="{ 'has-error': !hasCorrectAnswers }">
          <input
            :checked="correct.includes(index)"
            :disabled="disabled"
            @change="toggleAnswer(index)"
            type="checkbox">
        </span>
        <span :class="errorClass(index)">
          <input
            :ref="`input${index}`"
            :value="answers[index]"
            :disabled="disabled"
            @change="updateAnswer(index)"
            class="form-control"
            placeholder="Answer...">
        </span>
        <span @click="removeAnswer(index)" class="mdi mdi-close control"></span>
      </li>
    </ul>
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep';
import range from 'lodash/range';

const customAlert = {
  type: 'alert-danger',
  text: 'Please make at least two answers available !'
};

export default {
  props: {
    assessment: Object,
    isEditing: Boolean,
    errors: Array
  },
  computed: {
    answers() {
      return this.assessment.answers;
    },
    correct() {
      return this.assessment.correct;
    },
    feedback() {
      return this.assessment.feedback;
    },
    hasCorrectAnswers() {
      return !this.errors.includes('correct');
    },
    disabled() {
      return !this.isEditing;
    }
  },
  methods: {
    update(data) {
      this.$emit('update', data);
    },
    toggleAnswer(index) {
      let correct = cloneDeep(this.correct);
      const position = correct.indexOf(index);

      if (position < 0) {
        correct.push(index);
      } else {
        correct.splice(position, 1);
      }

      this.update({ correct });
    },
    updateAnswer(index) {
      let answers = cloneDeep(this.answers);
      answers[index] = this.$refs[`input${index}`][0].value;
      this.update({ answers });
    },
    addAnswer() {
      let answers = cloneDeep(this.answers);
      answers.push('');
      this.update({ answers });
    },
    removeAnswer(answerIndex) {
      let answers = cloneDeep(this.answers);
      let correct = cloneDeep(this.correct);
      let feedback = cloneDeep(this.feedback);

      answers.splice(answerIndex, 1);
      const index = correct.indexOf(answerIndex);
      if (index !== -1) correct.splice(index, 1);

      correct.forEach((it, i) => {
        if (it >= answerIndex) correct[i] = it - 1;
      });

      if (feedback) {
        range(answerIndex, answers.length).forEach(it => {
          feedback[it] = feedback[it + 1];
        });
        delete feedback[answers.length];
      }

      this.update({ answers, correct, feedback });
    },
    validate() {
      this.$emit('alert', this.answers.length < 2 ? customAlert : {});
    },
    errorClass(index) {
      return {
        'has-error': this.errors.includes(`answers[${index}]`)
      };
    }
  },
  watch: {
    assessment() {
      this.validate();
    }
  }
};
</script>

<style lang="scss" scoped>
h5 {
  display: block;
  margin: 30px 0 10px;
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

    input[type=checkbox] {
      position: absolute;
      top: 5px;
      left: 0;
    }
  }

  .mdi-close {
    position: absolute;
    right: 5px;
    bottom: 5px;
    padding: 5px;
    color: #888;
    cursor: pointer;

    &:hover {
      color: darken(#888, 20%);
    }
  }
}

.has-error {
  input[type="checkbox"]::after {
    border-color: #d9534f;
  }

  input[type="checkbox"]:checked::after {
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
