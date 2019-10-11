<template>
  <div class="form-group">
    <span class="form-label">{{ isGraded ? 'Answers' : 'Options' }}</span>
    <button
      @click="addAnswer"
      :disabled="disabled"
      class="btn btn-link answers-add">
      <span class="mdi mdi-plus"></span>
    </button>
    <ul :class="{ 'non-graded': !isGraded }">
      <li
        v-for="(answer, index) in answers"
        :key="index">
        <span
          v-if="isGraded"
          :class="{ 'has-error': correctError }"
          class="answers-radio">
          <input
            @change="selectAnswer(index)"
            :checked="correct === index"
            :disabled="disabled"
            type="radio">
        </span>
        <v-avatar v-else size="32" color="primary">{{ index + 1 }}</v-avatar>
        <span :class="{ 'has-error': answerError(index) }" class="answers-input">
          <input
            :ref="`input${index}`"
            @change="updateAnswer(index)"
            :value="answer"
            :disabled="disabled"
            :placeholder="isGraded ? 'Answer...' : 'Option...'"
            type="text">
        </span>
        <button @click="removeAnswer(index)" :disabled="disabled" class="destroy">
          <span class="mdi mdi-close"></span>
        </button>
      </li>
    </ul>
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep';
import { defaults } from 'utils/assessment';
import range from 'lodash/range';

const customAlert = {
  type: 'alert-danger',
  text: 'Please make at least two answers available !'
};

export default {
  props: {
    assessment: { type: Object, default: defaults.SC },
    isGraded: { type: Boolean, default: false },
    errors: { type: Array, default: () => ([]) },
    isEditing: { type: Boolean, default: false }
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

      if (this.isGraded) {
        if (correct === index) correct = null;
        if (correct && correct >= index) correct -= 1;
      }

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
    assessment: {
      deep: true,
      handler: function () {
        this.validate();
      }
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

  &.non-graded {
    padding-left: 30px;
  }

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

    .v-avatar {
      float: left;
      margin-top: 4px;
      margin-right: 6px;
      color: #fff;
      font-weight: 700;
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
