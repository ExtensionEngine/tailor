<template>
  <div class="form-group">
    <span class="form-label">Answers</span>
    <button
      :disabled="disabled"
      @click="addAnswer"
      class="btn btn-default answers-add">
      <span class="fa fa-plus"></span>
    </button>
    <ul>
      <li v-for="(answer, index) in answers">
        <input
          v-model="correct"
          :value="index"
          :disabled="disabled"
          @change="update"
          type="radio">
        <span class="answers-input" :class="{ 'has-error': answerError(index) }">
          <input
            v-model="answers[index]"
            :disabled="disabled"
            @blur="update"
            type="text"
            placeholder="Answer...">
        </span>
        <button :disabled="disabled" @click="removeAnswer(index)" class="destroy">
          <span class="fa fa-times"></span>
        </button>
      </li>
    </ul>
  </div>
</template>

<script>
const customAlert = {
  text: 'Please make at least two answers available !',
  type: 'alert-danger'
};

export default {
  props: {
    assessment: Object,
    errors: Array,
    isEditing: Boolean
  },
  data() {
    return {
      answers: this.assessment.answers,
      correct: this.assessment.correct
    };
  },
  computed: {
    disabled() {
      return !this.isEditing;
    }
  },
  methods: {
    answerError(index) {
      return this.errors.includes(`answers[${index}]`);
    },
    addAnswer() {
      this.answers.push('');
      this.update();
    },
    removeAnswer(index) {
      this.answers.splice(index, 1);

      if (this.correct === index) this.correct = null;
      if (this.correct >= index) this.correct -= 1;

      this.update();
    },
    validate() {
      this.$emit('alert', this.answers.length < 2 ? customAlert : {});
    },
    update() {
      this.$emit('update', { answers: this.answers, correct: this.correct });
      this.validate();
    }
  },
  watch: {
    isEditing(newVal) {
      if (newVal) return;
      this.answers = this.assessment.answers;
      this.correct = this.assessment.correct;
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
  padding: 7px;
  height: 28px;
  width: 50px;
  float: right;
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

    input[type=radio] {
      float: left;
      margin-top: 12px;
      width: 19px;
      padding-bottom: 9px;
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
