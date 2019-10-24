<template>
  <div :class="{ disabled }">
    <h5>{{ isGraded ? 'Answers' : 'Options' }}</h5>
    <span @click="addAnswer" class="btn btn-link mdi mdi-plus pull-right"></span>
    <ul>
      <li
        v-for="(answer, index) in answers"
        :key="index"
        :class="{ 'non-graded': !isGraded }">
        <span v-if="isGraded" :class="{ 'has-error': !hasCorrectAnswers }">
          <input
            @change="toggleAnswer(index)"
            :checked="correct.includes(index)"
            :disabled="disabled"
            type="checkbox">
        </span>
        <v-avatar v-else size="32" color="primary">{{ index + 1 }}</v-avatar>
        <span :class="errorClass(index)" class="input-container">
          <input
            :ref="`input${index}`"
            @change="updateAnswer(index)"
            :value="answers[index]"
            :disabled="disabled"
            :placeholder="isGraded ? 'Answer...' : 'Option...'"
            class="form-control">
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
    assessment: { type: Object, required: true },
    isGraded: { type: Boolean, default: false },
    errors: { type: Array, default: () => ([]) },
    isEditing: { type: Boolean, default: false }
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
      const correct = cloneDeep(this.correct);
      const position = correct.indexOf(index);

      if (position < 0) {
        correct.push(index);
      } else {
        correct.splice(position, 1);
      }

      this.update({ correct });
    },
    updateAnswer(index) {
      const answers = cloneDeep(this.answers);
      answers[index] = this.$refs[`input${index}`][0].value;
      this.update({ answers });
    },
    addAnswer() {
      const answers = cloneDeep(this.answers);
      answers.push('');
      this.update({ answers });
    },
    removeAnswer(answerIndex) {
      const answers = cloneDeep(this.answers);
      const correct = cloneDeep(this.correct);
      const feedback = cloneDeep(this.feedback);

      answers.splice(answerIndex, 1);

      if (this.isGraded) {
        const index = correct.indexOf(answerIndex);
        if (index !== -1) correct.splice(index, 1);
        correct.forEach((it, i) => {
          if (it >= answerIndex) correct[i] = it - 1;
        });
      }

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
    assessment: {
      deep: true,
      handler: function () {
        this.validate();
      }
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

    &.non-graded {
      padding-left: 0;
    }

    .v-avatar {
      float: left;
      margin-top: 1px;
      margin-right: 10px;
      color: #fff;
      font-weight: 700;
    }

    .input-container {
      display: flex;
    }

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
