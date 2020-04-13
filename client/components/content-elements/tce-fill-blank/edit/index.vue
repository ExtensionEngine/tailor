<template>
  <div v-if="hasAnswers" class="fill-blank">
    <span class="title">Answers</span>
    <draggable @update="update" :list="answerGroups" v-bind="dragOptions">
      <div v-for="(answers, i) in answerGroups" :key="i" class="mt-2">
        <span class="drag-handle">
          <span class="mdi mdi-drag-vertical"></span>
        </span>
        <v-chip label small>{{ i + 1 }}</v-chip>
        <v-btn
          @click="addAnswer(i)"
          :disabled="disabled"
          small icon tile class="float-right">
          <v-icon small>mdi-plus</v-icon>
        </v-btn>
        <v-btn
          v-if="hasExtraAnswers"
          @click="removeAnswerGroup(i)"
          :disabled="disabled"
          small icon tile class="float-right">
          <v-icon small>mdi-delete</v-icon>
        </v-btn>
        <!-- todo: fix -->
        <v-text-field
          v-for="(answer, j) in answers"
          :key="`${i}.${j}`"
          v-model="answers[j]"
          :disabled="disabled"
          placeholder="Answer...">
          <template slot="append">
            <v-btn
              v-if="answers.length > 1"
              @click="removeAnswer(i, j)"
              small icon tile class="remove">
              <v-icon small>mdi-close</v-icon>
            </v-btn>
          </template>
        </v-text-field>
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

const TEXT_CONTAINERS = ['JODIT_HTML', 'HTML'];
const PLACEHOLDER = /(@blank)/g;
const ALERT = {
  type: 'alert-danger',
  text: `Question and blanks are out of sync !
        Please delete unnecessary answers or add blanks in the question !`
};

const getTextAssets = item => filter(item, it => TEXT_CONTAINERS.includes(it.type));

export default {
  props: {
    assessment: { type: Object, default: defaults.FB },
    isGraded: { type: Boolean, default: false },
    errors: { type: Array, default: () => ([]) },
    isEditing: { type: Boolean, default: false }
  },
  computed: {
    disabled: vm => !vm.isEditing,
    question: vm => vm.assessment.question,
    answerGroups: vm => vm.assessment.correct,
    hasAnswers: vm => get(vm.answerGroups, 'length') > 0,
    hasExtraAnswers: vm => vm.answerGroups.length !== vm.blanksCount,
    blanksCount() {
      const textAssets = getTextAssets(this.question);
      return reduce(textAssets, (count, it) => {
        const content = get(it, 'data.content', '');
        return count + (content.match(PLACEHOLDER) || []).length;
      }, 0);
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
      // todo: fix
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
.fill-blank {
  width: 100%;
  padding: 1.5rem 1.25rem 1rem;
  text-align: left;
  overflow: hidden;

  .title {
    font-weight: 400;
  }

  .drag-handle {
    float: left;
    cursor: pointer;

    .mdi {
      color: #888;
      font-size: 1.375rem;
      line-height: 1.5rem;
    }
  }
}
</style>
