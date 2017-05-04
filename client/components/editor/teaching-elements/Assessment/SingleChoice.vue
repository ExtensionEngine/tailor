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
            :value="correct === index"
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
      let answers = cloneDeep(this.answers);
      answers.push('');
      this.update({ answers });
    },
    removeAnswer(index) {
      let answers = cloneDeep(this.answers);
      let correct = cloneDeep(this.correct);
      let feedback = cloneDeep(this.feedback);

      answers.splice(index, 1);

      if (correct === index) correct = null;
      if (correct && correct >= index) correct -= 1;

      if (feedback) {
        let nextFeedback = feedback[index + 1];
        if (nextFeedback) feedback[index] = nextFeedback;
        delete feedback[index + 1];
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
      this.validate();
    }
  }
};
</script>

<style lang="scss" scoped>
.form-group {
  text-align: left;
  margin: 0 auto;
  padding: 25px 20px 15px 20px;
  width: 100%;
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

ul {
  padding: 10px 0 0 50px;

  li {
    position: relative;
    display: inline-block;
    width: 100%;
    margin: 10px 0;

    .answers-radio {
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

@media (max-width: 850px) {
  ul {
    padding-left: 0;
  }
}
</style>
