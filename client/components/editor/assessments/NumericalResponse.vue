<template>
  <div class="assessment numerical-response">
    <div class="label label-primary assessment-type">Numerical response</div>
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
      <span class="form-label">Answer</span>
      <span
        :class="{ 'has-error': errors.includes('correct') }"
        class="answer">
        <input
          v-model="correct"
          :disabled="isEditing"
          class="form-control">
          <span class="help-block" type="text">
            Only numerical input allowed, if decimal number is needed please
            use '.' to separate numbers (e.g. '3.14').
          </span>
      </span>
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
        v-show="isEditing"
        class="alert alert-dismissible alert-success">
        <strong>Question saved !</strong>
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
      ...cloneDeep(defaultAssessment),
      ...cloneDeep(this.assessment),
      isEditing: !!this.assessment.question,
      errors: []
    };
  },
  methods: {
    save() {
      let question = {
        _cid: this.assessment._cid,
        type: this.type,
        question: this.question,
        correct: this.correct,
        hint: this.hint
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
  }
};
</script>

<style lang="scss" scoped>
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
