<template>
  <div class="assessment multiple-choice">
    <div class="row">
      <div class="col-lg-12 intro">
        <div class="label label-primary title">Multiple choice</div>
      </div>
    </div>
    <div class="row">
      <div class="col-lg-12 ">
        <div class="form-group">
          <span class="title-sub">Question</span>
          <span :class="{'has-error': errors.includes('question')}">
            <input
              class="form-control"
              type="text"
              :disabled="isDisabled"
              v-model="question"
              placeholder="Question..">
          </span>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-lg-12">
        <div class="form-group">
          <span class="title-sub">Answers</span>
          <button
            class="btn btn-default answers-add"
            type="button"
            :disabled="isDisabled"
            @click="addAnswer">
            <span class="fa fa-plus"></span>
          </button>
          <ul>
            <li v-for="(answer, index) in answers">
              <span
                  class="answers-checkbox"
                  :class="{'error': errors.includes('correctAnswer')}">
                <input
                  type="checkbox"
                  :disabled="isDisabled"
                  v-model="correctAnswer"
                  :value="index + 1">
              </span>
              <span
                class="answers-input"
                :class="{'has-error': errors.includes(`answers[${index}]`)}">
                <input
                  type="text"
                  :disabled="isDisabled"
                  v-model="answers[index]"
                  placeholder="Answer..">
              </span>
              <button
                class="destroy"
                type="button"
                :disabled="isDisabled"
                @click="removeAnswer(index)">
                <span class="fa fa-times"></span>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-lg-12">
        <div class="form-group">
          <span class="title-sub">Hint</span>
          <input
            class="form-control"
            type="text"
            :disabled="isDisabled"
            v-model="hint"
            placeholder="Optional hint..">
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-lg-12 final">
        <div class="alert-container">
          <div
            class="alert alert-dismissible alert-danger"
            v-show="answers.length < 3">
            <strong>Please make at least three answers available !</strong>
          </div>
          <div
            class="alert alert-dismissible alert-success"
            v-show="isSuccess">
            <strong>Question successfully saved !</strong>
          </div>
        </div>
        <button
          class="btn btn-default"
          type="button"
          :disabled="isDisabled"
          @click="save">
          Save Question
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import yup from 'yup';

const schema = yup.object().shape({
  question: yup.string().trim().min(1).required(),
  answers: yup.array().min(3).of(yup.string().trim().min(1)).required(),
  correctAnswer: yup.array().min(2).of(yup.number().min(1)).required()
});

export default {
  props: {
    'propQuestion': {
      type: String,
      default: ''
    },
    'propAnswers': {
      type: Array,
      default: ['', '', '']
    },
    'propCorrect': {
      type: Array,
      default: []
    },
    'propHint': {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      question: this.propQuestion,
      answers: this.propAnswers,
      correctAnswer: this.propCorrect,
      hint: this.propHint,
      isSuccess: false,
      isDisabled: false,
      errors: []
    };
  },
  methods: {
    addAnswer() {
      this.answers.push('');
    },
    removeAnswer(index) {
      this.answers.splice(index, 1);
      if (this.correctAnswer.indexOf(index + 1) !== -1) {
        this.correctAnswer.splice(this.correctAnswer.indexOf(index + 1), 1);
      }
    },
    save() {
      this.validate()
        .then(() => {
          this.errors = [];
          this.isSuccess = true;

          let question = {
            question: this.question,
            correct: this.correctAnswer,
            answers: this.answers,
            hint: this.hint
          };

          this.isDisabled = true;
          this.$emit('addQuestion', question);
          return;
        })
        .catch((err) => {
          this.errors = [];
          for (let i = 0; i < err.inner.length; i++) {
            this.errors.push(err.inner[i].path);
          }
        });
    },
    validate() {
      return schema.validate(
        {
          question: this.question,
          answers: this.answers,
          correctAnswer: this.correctAnswer
        },
        {
          recursive: true,
          abortEarly: false
        }
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

  .row {
    margin: 0;
  }

  [class*="col-"] {
    padding: 25px 10px 15px 10px;
  }

  .error {
    border-bottom: none;
    box-shadow: inset 0 -2px 0 #e51c23;
  }

  .btn[disabled] {
    box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.4);;
  }

  .alert-container {
    padding: 0 10px;
  }

  .alert {
    display: inline-block;
    margin: 0 auto;
    padding: 3px 7px;
    text-align: center;
  }

  .final {
    padding: 10px 10px 15px 10px;
    overflow: hidden;

    button {
      margin: 15px 10px 0 0;
      float: right;
    }
  }

  .intro {
    overflow: hidden;
    padding: 15px 10px 45px 10px;
  }

  .title {
    font-size: 13px;
    float: right;
    background-color: grey;
  }

  .title-sub {
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
    padding: 0 10px;
    width: 100%;
  }

  .form-control {
    width: 100%;
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
