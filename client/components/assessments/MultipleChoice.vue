<template>
  <div class="assessment multiple-choice">
    <div class="label label-primary assessment-type">Multiple choice</div>
    <div class="form-group">
      <span class="form-label">Question</span>
      <span :class="{'has-error': errors.includes('question')}">
        <input
          v-model="question"
          :disabled="isSuccess"
          class="form-control"
          type="text"
          placeholder="Question..">
      </span>
    </div>
    <div class="form-group">
      <span class="form-label">Answers</span>
      <button
        :disabled="isSuccess"
        @click="addAnswer"
        class="btn btn-default answers-add"
        type="button">
        <span class="fa fa-plus"></span>
      </button>
      <ul>
        <li v-for="(answer, index) in answers">
          <span
              class="answers-checkbox"
              :class="{'error': errors.includes('correct')}">
            <input
              v-model="correctAnswers"
              :value="index"
              :disabled="isSuccess"
              type="checkbox">
          </span>
          <span
            class="answers-input"
            :class="{'has-error': errors.includes(`answers[${index}]`)}">
            <input
              v-model="answers[index]"
              :disabled="isSuccess"
              type="text"
              placeholder="Answer..">
          </span>
          <button
            :disabled="isSuccess"
            @click="removeAnswer(index)"
            class="destroy"
            type="button">
            <span class="fa fa-times"></span>
          </button>
        </li>
      </ul>
    </div>
    <div class="form-group">
      <span class="form-label">Hint</span>
      <input
        v-model="hint"
        :disabled="isSuccess"
        class="form-control"
        type="text"
        placeholder="Optional hint..">
    </div>
    <div class="alert-container">
      <div
        v-show="answers.length < 3"
        class="alert alert-dismissible alert-danger">
        <strong>Please make at least three answers available !</strong>
      </div>
      <div
        v-show="isSuccess"
        class="alert alert-dismissible alert-success">
        <strong>Question successfully saved !</strong>
      </div>
    </div>
    <button
      :disabled="isSuccess"
      @click="save"
      class="btn btn-default"
      type="button">
      Save Question
    </button>
  </div>
</template>

<script>
import yup from 'yup';

const schema = yup.object().shape({
  question: yup.string().trim().min(1).required(),
  answers: yup.array().min(3).of(yup.string().trim().min(1)).required(),
  correct: yup.array().min(2).of(yup.number()).required()
});

export default {
  props: {
    'propQuestion': {
      type: String,
      default: ''
    },
    'propAnswers': {
      type: Array,
      default: function () {
        return ['', '', ''];
      }
    },
    'propCorrect': {
      type: Array,
      default: function () {
        return [];
      }
    },
    'propHint': {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      question: this.propQuestion,
      // slice array to avoid changing data in parent component
      answers: this.propAnswers.slice(0),
      correctAnswers: this.propCorrect,
      hint: this.propHint,
      isSuccess: false,
      errors: []
    };
  },
  methods: {
    addAnswer() {
      this.answers.push('');
    },
    removeAnswer(index) {
      this.answers.splice(index, 1);

      if (this.correctAnswers.indexOf(index) !== -1) {
        this.correctAnswers.splice(this.correctAnswers.indexOf(index), 1);
      }
    },
    save() {
      let question = {
        question: this.question,
        correct: this.correctAnswers,
        answers: this.answers,
        hint: this.hint
      };
      this.errors = [];

      this.validate(question)
        .then(() => {
          this.isSuccess = true;
          this.$emit('addQuestion', question);
        })
        .catch((err) => {
          err.inner.forEach((item) => {
            this.errors.push(item.path);
          });
        });
    },
    validate(question) {
      return schema.validate(
        question,
        { recursive: true, abortEarly: false }
      );
    }
  }
};
</script>

<style lang="scss">
.assessment.multiple-choice {
  max-width: 700px;
  min-height: 400px;
  margin: 10px auto;
  padding: 10px 30px 30px 30px;
  box-shadow: 0 2px 9px rgba(0, 0, 0, 0.74);
  overflow: hidden;

  .alert-container {
    padding: 0 20px;
  }

  .alert {
    display: inline-block;
    margin: 0 auto;
    padding: 3px 7px;
    text-align: center;
  }

  button {
    margin: 15px 10px 0 0;
    float: right;
  }

  .assessment-type {
    font-size: 13px;
    float: right;
    background-color: grey;
    margin: 15px 15px 50px 0;
  }

  .form-label {
    font-size: 20px;
  }

  .destroy {
    display: none;
    position: absolute;
    opacity: 0.6;
    transition: all 0.2s;
    border: 0;
    background-color: transparent;
    padding: 0;
    bottom: 8px;
    right: 10px;

    span {
      font-size: 16px;
    }
  }

  .destroy:focus {
    outline: none;
  }

  .answers-add {
    padding: 7px;
    height: 28px;
    width: 50px;
    float: right;
  }

  ul {
    padding: 10px 0 0 50px;

    li {
      display: inline-block;
      width: 100%;
      position: relative;
      margin: 10px 0;

      .answers-checkbox {
        display: inline-block;
        float: left;
        margin-top: 7px;
        width: 19px;

        input {
          padding-bottom: 11px;
        }
      }

      .answers-input {
        display: block;
        overflow: hidden;

        input {
          height: 40px;
          width: 100%;
          margin-left: 3px;
          padding: 0 33px 0 10px;
        }

        input:focus {
          outline: none;
        }
      }
    }

    li:hover {
      .destroy:enabled {
        display: inline;
      }
    }
  }

  .form-group {
    text-align: left;
    margin: 0 auto;
    padding: 25px 20px 15px 20px;
    width: 100%;
    overflow: hidden;
  }

  .form-control,
  .answers-input {
    padding-left: 10px !important;
  }
}

@media (max-width: 850px) {
  .assessment.multiple-choice {
    ul {
      padding-left: 0;
    }
  }
}
</style>
