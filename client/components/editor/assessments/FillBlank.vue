<template>
  <div class="form-group" v-if="hasAnswer">
    <span class="form-label">Answers</span>
    <span v-if="isEditing && hasMultipleAnswers" class="help-block">
      Arrange answers by dragging if needed !
    </span>
    <draggable :list="correct" :options="dragOptions" @update="update" class="draggable">
      <transition-group name="answers">
        <div v-for="(blank, index) in correct" ref="order" :key="index">
          <span class="badge">{{ index + 1 }}</span>
          <button
            :disabled="disabled"
            @click="addAnswer(index)"
            class="btn btn-default answers-add controls">
            <span class="fa fa-plus"></span>
          </button>
          <button
            v-show="isSynced"
            @click="removeBlank(index)"
            class="btn btn-default delete">
            <span class="fa fa-trash-o"></span>
          </button>
          <ul>
            <li v-for="(answer, indexAnswer) in blank">
              <span class="fa fa-bars fa-lg drag-handler"></span>
              <span
                class="answers-input"
                :class="{ 'has-error': answerError(index, indexAnswer)} ">
                <input
                  v-model="correct[index][indexAnswer]"
                  :disabled="disabled"
                  type="text"
                  @blur="update"
                  placeholder="Answer..">
              </span>
              <button
                :disabled="disabled"
                @click="removeAnswer(index, indexAnswer)"
                class="destroy controls">
                <span class="fa fa-times"></span>
              </button>
            </li>
          </ul>
        </div>
      </transition-group>
    </draggable>
  </div>
</template>

<script>
import debounce from 'lodash/debounce';
import draggable from 'vuedraggable';
import times from 'lodash/times';

const regex = /(@blank)/g;
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
      correct: this.assessment.correct
    };
  },
  methods: {
    parse() {
      let count = this.blanksCount - this.correct.length;
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
      let data = { correct: this.correct };
      this.$emit('update', data);
      this.validate();
    },
    answerError(index, indexAnswer) {
      return this.errors.includes(`correct[${index}][${indexAnswer}]`);
    }
  },
  computed: {
    dragOptions() {
      return {
        disabled: this.disabled || !this.hasMultipleAnswers,
        handle: '.drag-handler'
      };
    },
    disabled() {
      return !this.isEditing;
    },
    question() {
      return this.assessment.question;
    },
    blanksCount() {
      return (this.question.match(regex) || []).length;
    },
    isSynced() {
      return this.correct.length !== this.blanksCount;
    },
    hasAnswer() {
      return this.correct.length > 0;
    },
    hasMultipleAnswers() {
      return this.correct.length > 1;
    }
  },
  watch: {
    question: debounce(
      function() {
        this.parse();
      }, 500
    ),
    isEditing(newVal) {
      if (!newVal) this.correct = this.assessment.correct;
    }
  }
};
</script>

<style lang="scss" scoped>
.badge {
  font-size: 14px;
  padding: 3px 7px 2px;
  position: relative;
  top: 8px;
}

.destroy {
  margin: 15px 0 0 0;
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
  margin-right: 2px;
}

.form-label {
  font-size: 20px;
}

.draggable div {
  padding: 10px 0 0 50px;
  width: 100%;

  .drag-handler {
    position: absolute;
    left: -8px;
    top: 14px;
    cursor: move;
  }

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

.form-label {
  font-size: 20px;
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

@media (max-width: 850px) {
  ul {
    padding-left: 0;
    ul {
      padding-left: 0;
    }
  }
}
</style>
