<template>
  <div class="assessment fill-blank">
    <div class="label label-primary assessment-type">Fill in the blank</div>
    <div class="form-group">
      <span class="form-label">Question</span>
      <span :class="{ 'has-error': questionError }">
        <textarea
          v-model="question"
          :disabled="isEditing"
          class="form-control"
          rows="6"
          type="text">
        </textarea>
      </span>
      <span class="help-block" type="text">
        Type "@blank" when new blank is needed.
      </span>
    </div>
    <div class="form-group" v-if="hasAnswer">
      <span class="form-label">Answers</span>
      <span v-if="hasMultipleAnswers" class="help-block" type="text">
        Arrange answers by dragging if needed !
      </span>
      <draggable
        :list="correct"
        :options="{ disabled: isEditing || !hasMultipleAnswers }"
        class="draggable">
        <transition-group name="answers">
          <div v-for="(blank, index) in correct" ref="order" :key="index">
            <span class="blank-label"> ({{ index + 1 }}) </span>
            <button
              :disabled="isEditing"
              @click="addAnswer(index)"
              class="btn btn-default answers-add controls"
              type="button">
              <span class="fa fa-plus"></span>
            </button>
            <button
              v-show="isSynced > 0"
              @click="removeBlank(index)"
              class="btn btn-default delete"
              type="button">
              <span class="fa fa-trash-o"></span>
            </button>
            <ul>
              <li v-for="(answer, indexAnswer) in blank">
                <span
                  class="answers-input"
                  :class="{ 'has-error': answerError(index, indexAnswer)} ">
                  <input
                    v-model="correct[index][indexAnswer]"
                    :disabled="isEditing"
                    type="text"
                    placeholder="Answer..">
                </span>
                <button
                  :disabled="isEditing"
                  @click="removeAnswer(index, indexAnswer)"
                  class="destroy controls"
                  type="button">
                  <span class="fa fa-times"></span>
                </button>
              </li>
            </ul>
          </div>
        </transition-group>
      </draggable>
    </div>
    <div class="alert-container">
      <div
        v-show="isSynced || isEditing"
        :class="alertType"
        class="alert alert-dismissible">
        <strong>{{ alert }}</strong>
      </div>
    </div>
   <div class="controls" v-if="!isEditing">
     <button :disabled="isSynced" @click="save" class="btn btn-default" type="button">
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
import debounce from 'lodash/debounce';
import draggable from 'vuedraggable';
import times from 'lodash/times';
import yup from 'yup';

const schema = yup.object().shape({
  question: yup.string().trim().matches(/\(\d+\)_{10}/).required(),
  correct: yup.array().of(yup.array().min(1).of(yup.string().trim().min(1).required()))
});

const regex = '\\(\\d+\\)_{10}';

const defaultAssessment = {
  question: '',
  correct: []
};

export default {
  components: {
    draggable
  },
  props: { assessment: Object },
  data() {
    return {
      ...cloneDeep(defaultAssessment),
      ...cloneDeep(this.assessment),
      isEditing: !!this.assessment.question,
      alert: '',
      errors: []
    };
  },
  methods: {
    parse() {
      let index = 0;
      const searchValue = new RegExp(`(@blank|${regex})`, 'g');
      const newValue = () => ++index && `(${index})__________`;
      this.question = this.question.replace(searchValue, newValue);

      let count = index - this.correct.length;
      this.correct.push(...times(count, () => ['']));
    },
    addAnswer(index) {
      this.correct[index].push('');
    },
    removeAnswer(index, indexAnswer) {
      if (this.correct[index].length !== 1) this.correct[index].splice(indexAnswer, 1);
    },
    removeBlank(index) {
      this.correct.splice(index, 1);
    },
    save() {
      let question = {
        _cid: this.assessment._cid,
        type: this.type,
        question: this.question,
        correct: this.correct
      };
      this.errors = [];
      this.validate(question)
        .then(() => {
          this.$emit('save', question);
          this.isEditing = true;
        })
        .catch(err => err.inner.forEach(item => this.errors.push(item.path)));
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
    },
    answerError(index, indexAnswer) {
      return this.errors.includes(`correct[${index}][${indexAnswer}]`);
    }
  },
  computed: {
    alertType() {
      if (this.isSynced) {
        this.alert = `Question and blanks are out of sync ! Please delete
                      unnecessary answers or add blanks in the question !`;
        return 'alert-danger';
      } else {
        this.alert = 'Question saved !';
        return 'alert-success';
      }
    },
    isSynced() {
      let blanksCount = this.question.match(new RegExp(regex, 'g'));

      if (blanksCount) return this.correct.length !== blanksCount.length;

      return this.correct.length !== 0;
    },
    hasAnswer() {
      return this.correct.length > 0;
    },
    hasMultipleAnswers() {
      return this.correct.length > 1;
    },
    questionError() {
      return this.errors.includes('question');
    }
  },
  watch: {
    question: debounce(
      function () {
        this.parse();
      }, 500
    )
  }
};
</script>

<style lang="scss">
.assessment.fill-blank {
  min-height: 400px;
  margin: 10px auto;
  padding: 10px 30px 30px 30px;
  background-color: white;
  overflow: hidden;

  .alert-container {
  padding: 0 20px;
  }

  button {
    margin: 15px 10px 0 0;
    float: right;
  }

  .alert {
    display: inline-block;
    margin: 0 auto;
    padding: 3px 7px;
    text-align: center;

  }

  .controls {
    overflow: hidden;
    padding: 10px;
  }

  textarea {
    margin-top: 25px;
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

  .blank-label {
    font-size: 18px;
  }

  .destroy {
    margin: 15px 10px 0 0;
    float: right;
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

  .delete {
    float: right;
    padding: 3px 10px 0 10px;
    margin-right: 10px;
  }

  .answers-add {
    float: right;
    padding: 3px 10px 0 10px;
    margin: 15px 10px 0 0;
    float: right;
  }

  .draggable div {
    padding: 10px 0 0 50px;
    width: 100%;

    ul {
      padding: 0 0 0 10px;
    }

    li {
      display: inline-block;
      width: 100%;
      position: relative;
      margin: 10px 0;

      .answers-input {
        display: block;
        overflow: hidden;

        input {
          height: 40px;
          width: 100%;
          margin-left: 3px;
          padding: 0 33px 0 10px;
        }

        input[disabled] {
          background-color: #eeeeee;
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
  .assessment.fill-blank{
    ul {
      padding-left: 0;
      ul {
        padding-left: 0;
      }
    }
  }
}
</style>
