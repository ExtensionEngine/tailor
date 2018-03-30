<template>
  <div class="form-group">
    <span class="form-label">Answers</span>
    <button
      :disabled="disabled"
      @click="addAnswer"
      class="btn btn-link answers-add">
      <span class="mdi mdi-plus"></span>
    </button>
    <ul>
      <li v-for="(answer, index) in answers">
        <span :class="{ 'has-error': correctError }" class="answers-radio">
          <input
            :checked="correct === index"
            :disabled="disabled"
            @change="selectAnswer(index)"
            type="radio">
        </span>
        <span :class="{ 'has-error': answerError(index) }" class="answers-input">
          <input
            :ref="`input${index}`"
            :value="answer"
            :disabled="disabled"
            @change="updateAnswer(index)"
            type="text"
            placeholder="Answer...">
        </span>
        <button :disabled="disabled" @click="removeAnswer(index)" class="destroy">
          <span class="mdi mdi-close"></span>
        </button>
      </li>
    </ul>
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep';
import range from 'lodash/range';

const customAlert = {
  type: 'alert-danger',
  text: 'Please make at least two answers available !'
};

export default {
  props: {
    assessment: Object,
    isEditing: Boolean,
    errors: Array
  },
  computed: {
    answers() {
      return this.assessment.answers;
    },
    correct() {
      return this.assessment.correct;
    },
    feedback() {
      return this.assessment.feedback;
    },
    correctError() {
      return this.errors.includes('correct');
    },
    disabled() {
      return !this.isEditing;
    }
  },
  methods: {
    addAnswer() {
      const answers = cloneDeep(this.answers);
      answers.push('');
      this.update({ answers });
    },
    updateAnswer(index) {
      const answers = cloneDeep(this.answers);
      answers[index] = this.$refs[`input${index}`][0].value;
      this.update({ answers });
    },
    removeAnswer(index) {
      const answers = cloneDeep(this.answers);
      let correct = cloneDeep(this.correct);
      const feedback = cloneDeep(this.feedback);

      answers.splice(index, 1);

      if (correct === index) correct = null;
      if (correct && correct >= index) correct -= 1;

      if (feedback) {
        range(index, answers.length).forEach(it => {
          feedback[it] = feedback[it + 1];
        });
        delete feedback[answers.length];
      }

      this.update({ answers, correct, feedback });
    },
    selectAnswer(index) {
      this.update({ correct: index });
    },
    answerError(index) {
      return this.errors.includes(`answers[${index}]`);
    },
    validate() {
      this.$emit('alert', this.answers.length < 2 ? customAlert : {});
    },
    update(data) {
      this.$emit('update', data);
    }
  },
  watch: {
    assessment() {
      this.validate();
    }
  }
};
</script>

<style lang="scss" scoped>
.form-group {
  text-align: left;
  width: 100%;
  margin: 0 auto;
  padding: 25px 20px 15px;
  overflow: hidden;
}

.form-label {
  font-size: 20px;
}

.answers-add {
  float: right;
  font-size: 16px;
}

.destroy {
  display: none;
  position: absolute;
  right: 10px;
  bottom: 8px;
  padding: 0;
  background-color: transparent;
  opacity: 0.6;
  transition: all 0.2s;
  border: 0;

  span {
    font-size: 16px;
  }
}

.destroy:focus {
  outline: none;
}

ul {
  padding: 10px 0 0 50px;

  li {
    display: inline-block;
    position: relative;
    width: 100%;
    margin: 10px 0;

    .answers-radio {
      float: left;
      width: 19px;
      margin-top: 7px;

      input {
        padding-bottom: 9px;
      }
    }

    .answers-input {
      display: block;
      overflow: hidden;

      input {
        width: 100%;
        height: 40px;
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

@media (max-width: 850px) {
  ul {
    padding-left: 0;
  }
}
</style>
