<template>
  <div v-if="hasBlanks">
    <h5>Answers</h5>
    <draggable :list="answers" :options="dragOptions" @update="save">
      <div v-for="(blank, i) in answers" :key="i" class="answer-group">
        <span class="fa fa-bars"></span>
        <span class="label">{{ i + 1 }}</span>
        <span
          :disabled="disabled"
          @click="addAnswer(i)"
          class="fa fa-plus btn btn-link pull-right">
        </span>
        <span
          v-if="hasExtraAnswers"
          :disabled="disabled"
          @click="removeBlank(i)"
          class="fa fa-trash-o btn btn-link pull-right">
        </span>
        <ul>
          <li v-for="(answer, j) in blank" :class="errorClass(i, j)">
            <input
              v-model="answers[i][j]"
              :disabled="disabled"
              @blur="save"
              type="text"
              class="form-control"
              placeholder="Answer...">
            <span @click="removeAnswer(i, j)" class="fa fa-times"></span>
          </li>
        </ul>
      </div>
    </draggable>
  </div>
</template>

<script>
import debounce from 'lodash/debounce';
import draggable from 'vuedraggable';
import times from 'lodash/times';

const PLACEHOLDER = /(@blank)/g;
const ALERT = {
  type: 'alert-danger',
  text: `Question and blanks are out of sync !
        Please delete unnecessary answers or add blanks in the question !`
};

export default {
  props: {
    assessment: Object,
    errors: Array,
    isEditing: Boolean
  },
  computed: {
    question() {
      return this.assessment.question;
    },
    answers() {
      return this.assessment.correct;
    },
    hasBlanks() {
      return this.answers.length > 0;
    },
    blanksCount() {
      return (this.question.match(PLACEHOLDER) || []).length;
    },
    hasExtraAnswers() {
      return this.answers.length !== this.blanksCount;
    },
    disabled() {
      return !this.isEditing;
    },
    dragOptions() {
      return {
        disabled: this.disabled || !(this.answers.length > 1),
        handle: '.fa-bars'
      };
    }
  },
  methods: {
    save() {
      if (!this.validate()) return;
      this.$emit('update', { correct: this.answers });
    },
    addAnswer(index) {
      this.answers[index].push('');
      this.save();
    },
    removeAnswer(index, indexAnswer) {
      if (this.answers[index].length === 1) return;
      this.answers[index].splice(indexAnswer, 1);
      this.save();
    },
    removeBlank(index) {
      this.answers.splice(index, 1);
      this.save();
    },
    validate() {
      this.$emit('alert', this.hasExtraAnswers ? ALERT : {});
    },
    parse() {
      const count = this.blanksCount - this.answers.length;
      this.answers.push(...times(count, () => ['']));
      this.save();
    },
    errorClass(index, indexAnswer) {
      const answer = `answers[${index}][${indexAnswer}]`;
      return { 'has-error': this.errors.includes(answer) };
    }
  },
  watch: {
    isEditing(newVal) {
      if (!newVal) this.answers = this.assessment.answers;
    },
    question: debounce(
      function () {
        this.parse();
      }, 200
    )
  },
  components: { draggable }
};
</script>

<style lang="scss" scoped>
h5 {
  display: block;
  margin: 30px 0 10px 0;
  font-size: 18px;
  text-align: left;
}

.answer-group {
  padding: 10px;
  text-align: left;

  .fa-bars {
    float: left;
    font-size: 18px;
    margin: 1px 15px 0 0;
  }

  .label {
    font-size: 12px;
    padding: 0px 10px;
    border-radius: 1px;
    background-color: #aaa;
  }
}

ul {
  padding: 0 0 0 10px;
  list-style: none;

  li {
    position: relative;
    margin: 20px 0;
  }

  .fa-times {
    position: absolute;
    right: 5px;
    bottom: 5px;
    padding: 5px;
    cursor: pointer;
    color: #888;

    &:hover {
      color: darken(#888, 20%);
    }
  }
}
</style>
