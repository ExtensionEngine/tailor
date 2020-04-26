<template>
  <div>
    <div class="d-flex justify-space-between align-center">
      <span v-if="isGraded" class="title">{{ title }}</span>
      <span v-if="isEditing" class="body-2">{{ info }}</span>
    </div>
    <draggable v-model="correct" handle=".drag-handle">
      <v-card v-for="(group, i) in correct" :key="i" outlined class="group">
        <span :class="['drag-handle', { invisible: disabled }]">
          <span class="mdi mdi-drag-vertical"></span>
        </span>
        <v-chip label small>{{ i + 1 }}</v-chip>
        <v-btn
          v-if="isEditing"
          @click="addAnswer(i)"
          small icon class="float-right mr-4">
          <v-icon small>mdi-plus</v-icon>
        </v-btn>
        <v-btn
          v-if="isEditing && !isSynced"
          @click="removeAnswerGroup(i)"
          small icon class="float-right mr-1">
          <v-icon color="error" small>mdi-delete</v-icon>
        </v-btn>
        <v-text-field
          v-for="(answer, j) in group" :key="`${i}.${j}`"
          @change="updateAnswer(i, j, $event)"
          :value="answer"
          :disabled="disabled"
          :error="answerError(i, j)"
          :placeholder="placeholder"
          class="answer">
          <template slot="append">
            <v-btn
              v-if="isEditing && group.length > 1"
              @click="removeAnswer(i, j)"
              small icon>
              <v-icon small>mdi-close</v-icon>
            </v-btn>
          </template>
        </v-text-field>
      </v-card>
    </draggable>
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep';
import { defaults } from 'utils/assessment';
import Draggable from 'vuedraggable';
import get from 'lodash/get';
import pullAt from 'lodash/pullAt';
import reduce from 'lodash/reduce';
import size from 'lodash/size';
import times from 'lodash/times';

const TEXT_TYPES = ['JODIT_HTML', 'HTML'];
const BLANK = /(@blank)/g;

const TITLE = 'Answers';
const PLACEHOLDER = 'Answer...';
const INFO = 'Type "@blank" above when new blank is needed.';
const OUT_OF_SYNC_ALERT = {
  type: 'error',
  text: `Question and blanks are out of sync!
    Please delete unnecessary answers or add blanks in the question!`
};

const getBlankCount = question => {
  return reduce(question, (count, element) => {
    if (!TEXT_TYPES.includes(element.type)) return count;
    const content = get(element, 'data.content', '');
    return count + size(content.match(BLANK));
  }, 0);
};

export default {
  props: {
    assessment: { type: Object, default: defaults.FB },
    errors: { type: Array, default: () => ([]) },
    isEditing: { type: Boolean, default: false },
    isGraded: { type: Boolean, default: false }
  },
  computed: {
    // Each @blank has a corresponding array of possible
    // answers (answer group) in assessment.correct array
    correct: {
      get() { return this.assessment.correct; },
      set(correct) { this.update({ correct }); }
    },
    title: () => TITLE,
    info: () => INFO,
    placeholder: () => PLACEHOLDER,
    disabled: vm => !vm.isEditing,
    hasAnswers: vm => !!size(vm.correct),
    question: vm => vm.assessment.question,
    isSynced: vm => vm.blankCount === size(vm.correct),
    blankCount: vm => getBlankCount(vm.question)
  },
  methods: {
    addAnswer(groupIndex) {
      const correct = cloneDeep(this.correct);
      correct[groupIndex].push('');
      this.update({ correct });
    },
    updateAnswer(groupIndex, answerIndex, value) {
      const correct = cloneDeep(this.correct);
      correct[groupIndex][answerIndex] = value;
      this.update({ correct });
    },
    removeAnswer(groupIndex, answerIndex) {
      const correct = cloneDeep(this.correct);
      pullAt(correct[groupIndex], answerIndex);
      this.update({ correct });
    },
    removeAnswerGroup(groupIndex) {
      const correct = cloneDeep(this.correct);
      pullAt(correct, groupIndex);
      this.update({ correct });
    },
    attemptToSync() {
      const count = this.blankCount - this.correct.length;
      if (count <= 0) return;
      const correct = cloneDeep(this.correct);
      correct.push(...times(count, () => ['']));
      this.update({ correct });
    },
    validate() {
      this.$emit('alert', this.isSynced ? {} : OUT_OF_SYNC_ALERT);
    },
    update(value) {
      this.$emit('update', value);
    },
    answerError(groupIndex, answerIndex) {
      return this.errors.includes(`correct[${groupIndex}][${answerIndex}]`);
    }
  },
  watch: {
    question() { if (this.isGraded) this.attemptToSync(); },
    isSynced() { if (this.isGraded) this.validate(); }
  },
  created() {
    if (this.isGraded) this.validate();
  },
  components: { Draggable }
};
</script>

<style lang="scss" scoped>
.drag-handle {
  float: left;
  cursor: pointer;

  .invisible {
    visibility: none;
  }

  .mdi {
    color: #888;
    font-size: 1.375rem;
    line-height: 1.5rem;
  }
}

.group {
  margin: 1rem 0;
  padding: 1rem 0.5rem 0;

  .answer {
    margin-right: 1rem;
    margin-left: 1.375rem;
  }
}
</style>
