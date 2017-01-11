<template>
  <div class="assessment numerical-response">
    <div class="label label-primary assessment-type">Numerical response</div>
    <div class="form-group">
      <span class="form-label">Question</span>
      <span :class="{'has-error': errors.includes('question')}">
        <input
          class="form-control"
          v-model="question"
          :disabled="isEditing"
          type="text"
          placeholder="Question..">
      </span>
    </div>
    <div class="form-group">
      <span class="form-label">
        Answer
      </span>
      <span
        class="answer"
        :class="{'has-error': errors.includes('correct')}">
        <input
          class="form-control"
          v-model="correct"
          :disabled="isEditing">
          <span
            class="help-block"
            type="text">
            Only numerical input allowed, if decimal number is needed please use
            '.' to separate numbers (e.g. '3.14').
          </span>
      </span>
    </div>
    <div class="form-group">
      <span class="form-label">Hint</span>
      <input
        class="form-control"
        v-model="hint"
        :disabled="isEditing"
        type="text"
        placeholder="Optional hint..">
    </div>
    <div class="alert-container">
      <div
        class="alert alert-dismissible alert-success"
        v-show="isEditing">
        <strong>Question saved !</strong>
      </div>
    </div>
    <div class="controls" v-if="!isEditing">
      <button
        class="btn btn-default"
        @click="save"
        type="button">
        Save
      </button>
      <button
        class="btn btn-default"
        @click="close"
        type="button">
        Cancel
      </button>
    </div>
    <div class="controls" v-else>
      <button
        class="btn btn-default"
        @click="close"
        type="button">
        Close
      </button>
      <button
        class="btn btn-default"
        @click="edit"
        type="button">
        Edit
      </button>
    </div>
  </div>
</template>

<script>
import yup from 'yup';
import cloneDeep from 'lodash/cloneDeep';

const schema = yup.object().shape({
  question: yup.string().trim().min(1).required(),
  correct: yup.string().trim().matches(/^(^\d+$)|(^\d+\.\d+$)$/).required()
});

const defaultAssessment = {
  question: '',
  correct: '',
  hint: ''
};

export default {
  props: { assessment: Object },
  data() {
    return {
      ...(Object.assign(defaultAssessment, cloneDeep(this.assessment))),
      isEditing: !!this.assessment.question,
      errors: []
    };
  },
  methods: {
    save () {
      let question = {
        question: this.question,
        correct: this.correct,
        hint: this.hint,
        _cid: this.assessment._cid,
        type: this.type
      };
      this.errors = [];
      this.validate(question)
          .then(() => {
            this.isEditing = true;
            this.$emit('save', question);
          })
          .catch(err => {
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
    },
    close() {
      this.$emit('selected');
    },
    edit() {
      this.isEditing = false;
    }
  }
};
</script>


<style lang="scss">
.assessment.numerical-response {
  min-height: 400px;
  margin: 10px auto;
  padding: 10px 30px 30px 30px;
  background-color: white;
  overflow: hidden;

  .alert-container {
    padding: 0 10px;
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
    margin: 15px 15px 50px 0;
    float: right;
    background-color: grey;
  }

  .form-label {
    font-size: 20px;
  }

  .answer {
    padding: 10px 0 0 50px;
    font-size: 16px;
    margin: 10px 0;
  }

  ul {
    padding: 10px 0 0 50px;

    li {
      display: inline-block;
      width: 100%;
      margin: 10px 0;

      .answers {
        vertical-align: bottom;
        font-size: 16px;
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

  .form-control {
    padding-left: 10px !important;
  }
}

@media (max-width: 850px) {
  .assessment.true-false {
    ul {
      padding-left: 0;
    }
  }
}
</style>
