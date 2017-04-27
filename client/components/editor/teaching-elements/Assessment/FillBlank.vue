<template>
  <div v-if="hasAnswers" :class="{ 'disabled': disabled }">
    <h5>Answers</h5>
    <draggable :list="answerGroups" :options="dragOptions" @update="update">
      <div v-for="(answers, i) in answerGroups" :key="i" class="answer-group">
        <span class="fa fa-bars"></span>
        <span class="label">{{ i + 1 }}</span>
        <span
          @click="addAnswer(i)"
          class="fa fa-plus btn btn-link pull-right">
        </span>
        <span
          v-if="hasExtraAnswers"
          @click="removeAnswerGroup(i)"
          class="fa fa-trash-o btn btn-link pull-right">
        </span>
        <ul>
          <li v-for="(answer, j) in answers" :class="errorClass(i, j)">
            <input
              v-model="answers[j]"
              :disabled="disabled"
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
import filter from 'lodash/filter';
import get from 'lodash/get';
import reduce from 'lodash/reduce';
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
    answerGroups() {
      return this.assessment.correct;
    },
    hasAnswers() {
      return this.answerGroups.length > 0;
    },
    hasExtraAnswers() {
      return this.answerGroups.length !== this.blanksCount;
    },
    blanksCount() {
      const textAssets = filter(this.question, { type: 'HTML' });
      return reduce(textAssets, (count, it) => {
        const content = get(it, 'data.content', '');
        return count + (content.match(PLACEHOLDER) || []).length;
      }, 0);
    },
    disabled() {
      return !this.isEditing;
    },
    dragOptions() {
      return {
        disabled: this.disabled || !(this.answerGroups.length > 1),
        handle: '.fa-bars'
      };
    }
  },
  methods: {
    update() {
      this.validate();
      this.$emit('update', { correct: this.answerGroups });
    },
    addAnswer(index) {
      this.answerGroups[index].push('');
      this.update();
    },
    removeAnswer(groupIndex, answerIndex) {
      if (this.answerGroups[groupIndex].length === 1) return;
      this.answerGroups[groupIndex].splice(answerIndex, 1);
      this.update();
    },
    removeAnswerGroup(index) {
      this.answerGroups.splice(index, 1);
      this.update();
    },
    validate() {
      this.$emit('alert', this.hasExtraAnswers ? ALERT : {});
    },
    parse() {
      const count = this.blanksCount - this.answerGroups.length;
      this.answerGroups.push(...times(count, () => ['']));
      this.update();
    },
    errorClass(groupIndex, answerIndex) {
      const answer = `correct[${groupIndex}][${answerIndex}]`;
      return { 'has-error': this.errors.includes(answer) };
    },
    hasChanges(newVal, oldVal) {
      let v1 = reduce(oldVal, (r, it) => r + get(it, 'data.content', ''), '');
      let v2 = reduce(newVal, (r, it) => r + get(it, 'data.content', ''), '');
      return v1 !== v2;
    }
  },
  watch: {
    isEditing(newVal) {
      if (!newVal) this.answerGroups = this.assessment.answerGroups;
    },
    question: debounce(function (newVal, oldVal) {
      if (!this.hasChanges(newVal, oldVal)) return;
      this.parse();
    }, 200)
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
    margin: 1px 15px 0 0;
    font-size: 18px;
  }

  .label {
    padding: 1px 10px;
    font-size: 12px;
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

.disabled {
  pointer-events:none;
}
</style>
