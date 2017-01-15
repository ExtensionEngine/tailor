<template>
  <div class="assessment single-choice">
    <div class="label label-primary assessment-type">Single choice</div>
    <div class="form-group">
      <span class="form-label">Question</span>
      <span :class="{ 'has-error': errors.includes('question') }">
        <input
          v-model="question"
          :disabled="isEditing"
          class="form-control"
          type="text"
          placeholder="Question...">
      </span>
    </div>
    <div class="form-group">
      <span class="form-label">Answers</span>
      <button
        :disabled="isEditing"
        @click="addAnswer"
        class="btn btn-default answers-add"
        type="button">
        <span class="fa fa-plus"></span>
      </button>
      <ul>
        <li v-for="(answer, index) in answers">
          <span
            :class="{ 'has-error': errors.includes('correct') }"
            class="answers-radio">
            <input
              v-model="correct"
              :value="index"
              :disabled="isEditing"
              type="radio">
          </span>
          <span
            :class="{ 'has-error': errors.includes(`answers[${index}]`) }"
            class="answers-input">
            <input
              v-model="answers[index]"
              :disabled="isEditing"
              type="text"
              placeholder="Answer...">
          </span>
          <button
            :disabled="isEditing"
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
        :disabled="isEditing"
        class="form-control"
        type="text"
        placeholder="Optional hint...">
    </div>
    <div class="alert-container">
      <div
        v-show="answers.length < 2 || isEditing"
        :class="alertType"
        class="alert alert-dismissible">
        <strong>{{ alert }}</strong>
      </div>
    </div>
    <div v-if="!isEditing" class="controls">
      <button @click="save" class="btn btn-default" type="button">
        Save
      </button>
      <button @click="close" class="btn btn-default" type="button">
        Cancel
      </button>
    </div>
    <div v-else class="controls">
      <button @click="close" class="btn btn-default" type="button">
        Close
      </button>
      <button @click="edit" class="btn btn-default" type="button">
        Edit
      </button>
    </div>
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep';
import yup from 'yup';

const schema = yup.object().shape({
  question: yup.string().trim().min(1).required(),
  answers: yup.array().min(2).of(yup.string().trim().min(1)).required(),
  correct: yup.number().required()
});

const defaultAssessment = {
  question: '',
  answers: ['', ''],
  correct: '',
  hint: ''
};

export default {
  props: { assessment: Object },
  data() {
    return {
      ...defaultAssessment,
      ...cloneDeep(this.assessment),
      isEditing: !!this.assessment.question,
      errors: [],
      alert: ''
    };
  },
  methods: {
    addAnswer() {
      this.answers.push('');
    },
    removeAnswer(index) {
      this.answers.splice(index, 1);
      if (this.correct === index) this.correct = null;
      if (this.correct >= index) this.correct -= 1;
    },
    save() {
      let question = {
        _cid: this.assessment._cid,
        question: this.question,
        correct: this.correct,
        answers: this.answers,
        hint: this.hint,
        type: this.type
      };
      this.errors = [];
      this.validate(question)
        .then(() => {
          this.isEditing = true;
          this.$emit('save', question);
        })
        .catch(err => err.inner.forEach(it => this.errors.push(it.path)));
    },
    validate(question) {
      const options = { recursive: true, abortEarly: false };
      return schema.validate(question, options);
    },
    close() {
      this.$emit('selected');
    },
    edit() {
      this.isEditing = false;
    }
  },
  computed: {
    alertType() {
      if (this.answers.length < 2) {
        this.alert = 'Please make at least two answers available !';
        return 'alert-danger';
      } else {
        this.alert = 'Question saved !';
        return 'alert-success';
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.assessment.single-choice {
  min-height: 400px;
  margin: 10px auto;
  padding: 10px 30px 30px 30px;
  background-color: white;
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

      .answers-radio {
        display: inline-block;
        float: left;
        margin-top: 7px;
        width: 19px;

        input {
          padding-bottom: 9px;
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
  .assessment.single-choice {
    ul {
      padding-left: 0;
    }
  }
}
</style>
