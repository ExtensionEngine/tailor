<template>
  <div class="form-group" v-if="hasAnswer">
    <span class="form-label">Answers</span>
    <span v-if="hasMultipleAnswers" class="help-block">
      Arrange answers by dragging if needed !
    </span>
    <draggable
      v-if="hasMultipleAnswers"
      :list="correct"
      :options="{ disabled: !isEditing }"
      @update="update"
      class="draggable">
      <transition-group name="questions">
        <span v-for="(element, index) in correct" ref="order" :key="index">
          {{ index + 1 }}
        </span>
      </transition-group>
    </draggable>
    <ul>
      <li v-for="(blank, index) in correct">
        <span class="blank-label"> ({{ index + 1 }}) </span>
        <button
          :disabled="!isEditing"
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
                :disabled="!isEditing"
                type="text"
                @blur="update"
                placeholder="Answer..">
            </span>
            <button
              :disabled="!isEditing"
              @click="removeAnswer(index, indexAnswer)"
              class="destroy controls"
              type="button">
              <span class="fa fa-times"></span>
            </button>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script>
import debounce from 'lodash/debounce';
import draggable from 'vuedraggable';
import times from 'lodash/times';

const regex = '\\(\\d+\\)_{10}';
const customAlert = {
  text: `Question and blanks are out of sync ! Please delete
         unnecessary answers or add blanks in the question !`,
  type: 'alert-danger'
};

export default {
  components: {
    draggable
  },
  props: {
    assessment: Object,
    errors: Array,
    isEditing: Boolean
  },
  data() {
    return {
      correct: this.assessment.correct,
      parsedQuestion: this.assessment.question
    };
  },
  methods: {
    parse() {
      let index = 0;
      const searchValue = new RegExp(`(@blank|${regex})`, 'g');
      const newValue = () => ++index && `(${index})__________`;
      this.parsedQuestion = this.question.replace(searchValue, newValue);

      let count = index - this.correct.length;
      this.correct.push(...times(count, () => ['']));
      this.update();
    },
    addAnswer(index) {
      this.correct[index].push('');
      this.update();
    },
    removeAnswer(index, indexAnswer) {
      if (this.correct[index].length !== 1) {
        this.correct[index].splice(indexAnswer, 1);
        this.update();
      }
    },
    removeBlank(index) {
      this.correct.splice(index, 1);
      this.update();
    },
    validate() {
      if (this.isSynced) this.$emit('alert', customAlert);
      else this.$emit('alert');
    },
    update(que) {
      let data = {
        question: this.parsedQuestion,
        correct: this.correct
      };
      this.$emit('update', data);
      this.validate();
    },
    answerError(index, indexAnswer) {
      return this.errors.includes(`correct[${index}][${indexAnswer}]`);
    }
  },
  computed: {
    question() {
      return this.assessment.question;
    },
    isSynced() {
      let blanksCount = this.question.match(new RegExp(regex, 'g'));

      if (blanksCount) return this.correct.length !== blanksCount.length;

      return this.correct.length !== blanksCount;
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
      function() {
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
  .draggable {
    font-size: 20px;
    margin: 0 auto;
    text-align: center;
    padding: 40px 0px 10px 0px;
    width: 100%;

    span {
      display: inline-block;

      span {
        padding: 0 10px;
        border: 1px solid #ddd;
      }

      &:hover {
        cursor: pointer;
      }
    }
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

  ul {
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

    li {
      li:hover {
        .destroy:enabled {
          display: inline;
        }
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
