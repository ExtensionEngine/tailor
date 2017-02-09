<template>
  <div class="assessment true-false">
    <div class="label label-primary assessment-type">True - false</div>
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
      <span class="form-label">Select correct answer</span>
      <ul>
        <li>
          <span :class="{ 'has-error': errors.includes('correct') }">
            <input
              v-model="correct"
              :disabled="isEditing"
              :value="true"
              type="radio">
          </span>
          <span class="answers">True</span>
        </li>
        <li>
          <span :class="{ 'has-error': errors.includes('correct') }">
            <input
              v-model="correct"
              :disabled="isEditing"
              :value="false"
              type="radio">
          </span>
          <span class="answers">False</span>
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
        v-show="isEditing && isSaved"
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
import yup from 'yup';
import cloneDeep from 'lodash/cloneDeep';

const schema = yup.object().shape({
  question: yup.string().trim().min(1).required(),
  correct: yup.boolean().required()
});

const defaultAssessment = {
  question: '',
  correct: null,
  hint: ''
};

export default {
  props: { assessment: Object },
  data() {
    return {
      ...cloneDeep(defaultAssessment),
      ...cloneDeep(this.assessment),
      isEditing: !!this.assessment.question,
      errors: [],
      isSaved: false
    };
  },
  methods: {
    save() {
      let question = {
        _cid: this.assessment._cid,
        question: this.question,
        correct: this.correct,
        hint: this.hint,
        type: this.type
      };
      this.errors = [];
      this.validate(question)
        .then(() => {
          this.isEditing = true;
          this.isSaved = true;
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
      this.isSaved = false;
    }
  }
};
</script>


<style lang="scss" scoped>
.assessment.true-false {
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
