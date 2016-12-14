<template>
  <div class="assessment multiple-choice"
       :class="{ error: userError, success: isSuccess}">
    <div class="row">
      <div class="col-lg-12">
        <h3>Multiple choice question</h3>
      </div>
    </div>
    <div class="row">
      <div class="col-lg-12 ">
        <div class="form-group">
          <label>Question</label>
          <input class="form-control"
                 type="text"
                 v-model="questionText"
                 placeholder="Your question goes here..">
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-lg-12">
        <div class="form-group">
          <label>
            Answers
          </label>
          <button class="btn btn-default answers-add"
                  v-on:click.stop.prevent="addAnswer">
                  &#10133;
          </button>
          <ul>
            <li v-for="(answer,index) in answers">
              <input class="answers-checkbox"
                     type="checkbox"
                     v-model="correctAnswer"
                     :value="index + 1">
              <input class="answers-input"
                   type="text"
                   v-model="answers[index]"
                   placeholder="Answers go here..">
              <button class="destroy"
                      v-on:click.stop.prevent="removeAnswer(index)">
                      &times;
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-lg-12">
        <div class="form-group">
          <label>Hint</label>
          <input class="form-control"
                 type="text"
                 v-model="hint"
                 placeholder="Optional hint goes here..">
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-lg-12">
        <button class="btn btn-default"
                type="button"
                v-on:click="save">
                Save Question
        </button>
      </div>
    </div>
    <div class="row">
      <div class="col-lg-12">
        <div class="alert alert-dismissible alert-danger" v-if="userError">
          <button class="close" type="button" v-on:click="closeAlert" data-dismiss="alert">&times;</button>
          <strong>{{alertMessage}}</strong>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      questionText: '',
      answers: ['', '', ''],
      correctAnswer: [],
      hint: '',
      userError: false,
      isSuccess: false,
      alertMessage: ''
    };
  },
  methods: {
    addAnswer () {
      this.answers.push('');
    },
    removeAnswer (index) {
      this.answers.splice(index, 1);
      if (this.correctAnswer.indexOf(index + 1) !== -1) {
        this.correctAnswer.splice(this.correctAnswer.indexOf(index + 1), 1);
      }
    },
    save () {
      let question = {};

      if (this.questionText === '') {
        this.userError = true;
        this.isSuccess = false;
        this.alertMessage = 'Please fill in the question !';
        return;
      }

      if (this.answers.indexOf('') !== -1) {
        this.userError = true;
        this.isSuccess = false;
        this.alertMessage = "Please don't leave any answers empty !";
        return;
      }

      if (this.correctAnswer.length < 2) {
        this.userError = true;
        this.isSuccess = false;
        this.alertMessage = 'Please mark at least two answers as correct !';
        return;
      }

      this.userError = false;
      this.isSuccess = true;
      question.questionText = this.questionText;
      question.correct = this.correctAnswer;
      question.answers = this.answers;
      question.hint = this.hint;
      this.$emit('addQuestion', question);
    },
    closeAlert () {
      this.userError = false;
    }
  }
};
</script>

<style lang="scss">

.error {
  border-color: rgba(253,4,4,.8) !important;
  outline: 0;
  box-shadow: 0 0 14px rgba(253,4,4,.8) !important;
}

.success {
  border-color: rgba(4,253,29,.8) !important;
  outline: 0;
  box-shadow: 0 0 14px rgba(4,253,29,.8) !important;
}

.multiple-choice {
  max-width: 700px;
  min-height: 400px;
  margin: 10px auto;
  padding: 30px 0;
  box-shadow: 0 2px 9px rgba(0, 0, 0, 0.74);

  .alert-danger {
    max-width: 500px;
    margin: 25px auto 25px auto;
  }

  .close:focus {
    outline: none !important;
  }

  h3 {
    display: inline-block;
    margin: 0 auto 35px auto;
  }

  label {
    font-size: 20px;
  }

  .destroy {
    display: none;
    position: absolute;
    font-size: 25px;
    font-weight: 300;
    line-height: 24px;
    opacity: 0.6;
    transition: all 0.2s;
    border: 0;
    background-color: transparent;
    padding: 0;
    top: 8px;
    right: 32px;
  }

  .destroy:focus {
    outline: none;
  }

  .answers-add {
    padding: 7px;
    height: 28px;
    width: 98px;
    margin-right: 5%;
    float: right;
  }

  ul {
    padding: 10px 0 0 52px;

    li {
      display: inline-block;
      width: 100%;
      position: relative;
      margin: 10px 0;

      .answers-checkbox {
        width: 18px;
      }

      .answers-input {
        width: 90%;
        padding-left: 10px;
        height: 40px;
        margin-left: 3px;
      }

      .answers-input:focus {
        outline: none;
      }
    }

    li:hover {
      .destroy {
        display: inline;
      }
    }
  }

  .form-group {
    text-align: left;
    margin: 25px auto 15px auto;
    padding: 0 10px;
    max-width: 560px;
  }

  .form-control {
    width: 100%;
  }

  div:nth-child(2),
  div:nth-child(4) {
    input {
      padding-left: 10px;
    }
  }

  div:nth-child(5) {
    button {
      margin: 10px 0;
    }
  }

  .row {
    margin: 0;
  }

  [class*="col-"] {
    padding-left: 0 !important;
    padding-right: 0 !important;
  }
}
</style>
