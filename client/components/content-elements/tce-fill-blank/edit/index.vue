<template>
  <div :class="{ 'pb-4': !hasAnswers }">
    <div class="d-flex justify-space-between subtitle-2">
      <span v-if="isGraded">Answers</span>
      <span v-else-if="isEditing">{{ blankCountInfo }}</span>
      <span v-if="isEditing">
        Type "@blank" above when new blank is needed.
      </span>
    </div>
    <draggable v-model="correct" handle=".drag-handle">
      <v-card
        v-for="(group, i) in correct" :key="i"
        class="mt-2 pt-2 transparent elevation-0">
        <div class="mb-4">
          <span v-if="isEditing" class="drag-handle">
            <v-icon>mdi-drag-vertical</v-icon>
          </span>
          <v-chip :color="color" dark label small>{{ i + 1 }}</v-chip>
          <v-btn
            v-if="isEditing && !isSynced"
            @click="removeAnswerGroup(i)"
            color="secondary darken-1"
            text small
            class="float-right px-2">
            <v-icon small class="mr-2">mdi-delete</v-icon>
            Delete answer group
          </v-btn>
        </div>
        <v-text-field
          v-for="(answer, j) in group" :key="`${i}.${j}`"
          @change="updateAnswer(i, j, $event)"
          :value="answer"
          :error="answerError(i, j)"
          :disabled="disabled"
          :color="color"
          placeholder="Answer..."
          filled>
          <template slot="append">
            <v-btn
              v-if="isEditing && group.length > 1"
              @click="removeAnswer(i, j)"
              small icon>
              <v-icon small>mdi-close</v-icon>
            </v-btn>
          </template>
        </v-text-field>
        <div class="d-flex justify-end mb-5">
          <v-btn
            v-if="isEditing"
            @click="addAnswer(i)"
            color="color"
            text
            class="px-2">
            <v-icon small class="mr-1">mdi-plus</v-icon>
            Add answer
          </v-btn>
        </div>
      </v-card>
    </draggable>
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep';
import { defaults } from 'utils/assessment';
import Draggable from 'vuedraggable';
import EventBus from 'EventBus';
import get from 'lodash/get';
import pluralize from 'pluralize';
import pullAt from 'lodash/pullAt';
import reduce from 'lodash/reduce';
import size from 'lodash/size';
import times from 'lodash/times';

const appChannel = EventBus.channel('app');

const TEXT_TYPES = ['JODIT_HTML', 'HTML'];
const BLANK = /(@blank)/g;

const OUT_OF_SYNC_ERR = {
  type: 'error',
  text: `
    Question and blanks are out of sync!
    Please delete unnecessary answers or add blanks in the question!`
};

const getBlankCount = question => {
  return reduce(question, (count, element) => {
    if (!TEXT_TYPES.includes(element.type)) return count;
    const content = get(element, 'data.content', '');
    return count + size(content.match(BLANK));
  }, 0);
};

const getCountInfo = count => `${count} ${pluralize('blank', count)} detected.`;

export default {
  props: {
    assessment: { type: Object, default: defaults.FB },
    errors: { type: Array, default: () => ([]) },
    isEditing: { type: Boolean, default: false },
    isGraded: { type: Boolean, default: false }
  },
  computed: {
    correct: {
      get() { return this.assessment.correct; },
      set(correct) { this.update({ correct }); }
    },
    question: vm => vm.assessment.question,
    disabled: vm => !vm.isEditing,
    hasAnswers: vm => !!size(vm.correct),
    blankCount: vm => getBlankCount(vm.question),
    blankCountInfo: vm => getCountInfo(vm.blankCount),
    isSynced: vm => vm.blankCount === size(vm.correct),
    color: vm => vm.disabled ? 'grey' : 'grey darken-3'
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
      appChannel.emit('showConfirmationModal', {
        title: 'Delete answer group',
        message: 'Are you sure you want to delete this answer group?',
        action: () => {
          const correct = cloneDeep(this.correct);
          pullAt(correct, groupIndex);
          this.update({ correct });
        }
      });
    },
    attemptToSync() {
      const count = this.blankCount - this.correct.length;
      if (count <= 0) return;
      const correct = cloneDeep(this.correct);
      correct.push(...times(count, () => ['']));
      this.update({ correct });
    },
    validate() {
      this.$emit('alert', this.isSynced ? {} : OUT_OF_SYNC_ERR);
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
  margin-left: -0.375rem;
  cursor: pointer;

  .mdi {
    color: #888;
    font-size: 1.375rem;
    line-height: 1.5rem;
  }
}
</style>
