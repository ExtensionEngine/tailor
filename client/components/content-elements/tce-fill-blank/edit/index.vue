<template>
  <div v-if="hasAnswers" :class="{ disabled }">
    <h5>Answers</h5>
    <draggable @update="update" :list="answerGroups" v-bind="dragOptions">
      <div v-for="(answers, i) in answerGroups" :key="i" class="answer-group">
        <span class="drag-handle">
          <span class="mdi mdi-drag-vertical"></span>
        </span>
        <span class="label">{{ i + 1 }}</span>
        <span
          @click="addAnswer(i)"
          class="mdi mdi-plus btn btn-link pull-right">
        </span>
        <span
          v-if="hasExtraAnswers"
          @click="removeAnswerGroup(i)"
          class="mdi mdi-delete btn btn-link pull-right">
        </span>
        <ul>
          <li
            v-for="(answer, j) in answers"
            :key="`${i}.${j}`"
            :class="errorClass(i, j)">
            <input
              v-model="answers[j]"
              :disabled="disabled"
              type="text"
              class="form-control"
              placeholder="Answer...">
            <span @click="removeAnswer(i, j)" class="btn-remove mdi mdi-close"></span>
          </li>
        </ul>
      </div>
    </draggable>
  </div>
</template>

<script>
import debounce from 'lodash/debounce';
import { defaults } from 'utils/assessment';
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
    assessment: { type: Object, default: defaults.FB },
    isGraded: { type: Boolean, default: false },
    errors: { type: Array, default: () => ([]) },
    isEditing: { type: Boolean, default: false }
  },
  computed: {
    question() {
      return this.assessment.question;
    },
    answerGroups() {
      return this.assessment.correct;
    },
    hasAnswers() {
      return get(this.answerGroups, 'length') > 0;
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
        handle: '.drag-handle'
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
      const v1 = reduce(oldVal, (r, it) => r + get(it, 'data.content', ''), '');
      const v2 = reduce(newVal, (r, it) => r + get(it, 'data.content', ''), '');
      return v1 !== v2;
    }
  },
  watch: {
    isEditing(newVal) {
      if (!newVal) this.answerGroups = this.assessment.answerGroups;
    },
    question: debounce(function (newVal, oldVal) {
      if (!this.isGraded || !this.hasChanges(newVal, oldVal)) return;
      this.parse();
    }, 200)
  },
  components: { draggable }
};
</script>

<style lang="scss" scoped>
h5 {
  display: block;
  margin: 30px 0 10px;
  font-size: 18px;
  text-align: left;
}

.answer-group {
  padding: 10px;
  text-align: left;

  .drag-handle {
    float: left;
    cursor: pointer;

    .mdi {
      color: #888;
      font-size: 22px;
      line-height: 24px;
    }
  }

  .label {
    padding: 1px 10px;
    font-size: 12px;
    line-height: 24px;
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

  .btn-remove {
    position: absolute;
    right: 5px;
    bottom: 5px;
    padding: 5px;
    color: #888;
    cursor: pointer;

    &:hover {
      color: darken(#888, 20%);
    }
  }
}

.disabled {
  pointer-events: none;
}
</style>
