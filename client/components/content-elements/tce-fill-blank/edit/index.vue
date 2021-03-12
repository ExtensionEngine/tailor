<template>
  <div class="mt-2 mb-4">
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
          <v-chip
            :color="color"
            dark label small
            class="readonly">
            {{ i + 1 }}
          </v-chip>
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
          :error-messages="answerErrors(i, j)"
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
    <input-error v-if="isEditing" :error="syncError" />
  </div>
</template>

<script>
import { assessment } from '@extensionengine/tce-utils';
import cloneDeep from 'lodash/cloneDeep';
import Draggable from 'vuedraggable';
import get from 'lodash/get';
import { InputError } from '@tailor/components';
import { mapRequests } from '@extensionengine/vue-radio';
import pluralize from 'pluralize';
import pullAt from 'lodash/pullAt';
import reduce from 'lodash/reduce';
import size from 'lodash/size';
import times from 'lodash/times';

const TEXT_TYPES = ['JODIT_HTML', 'HTML'];
const BLANK = /(@blank)/g;

const SYNC_ERROR = `
  Question and blanks are out of sync! Please delete unnecessary answer groups
  or add blanks in the question!
`;

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
    assessment: { type: Object, default: assessment.defaults.FB },
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
    blankCount: vm => getBlankCount(vm.question),
    blankCountInfo: vm => getCountInfo(vm.blankCount),
    isSynced: vm => vm.blankCount === size(vm.correct),
    color: vm => vm.disabled ? 'grey' : 'grey darken-3',
    syncError: vm => (vm.isGraded && !vm.isSynced) ? SYNC_ERROR : ''
  },
  methods: {
    ...mapRequests('app', ['showConfirmationModal']),
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
      this.showConfirmationModal({
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
    update(value) {
      this.$emit('update', value);
    },
    answerErrors(groupIndex, answerIndex) {
      const path = `correct[${groupIndex}][${answerIndex}]`;
      return assessment.getErrorMessages(this.errors, path);
    }
  },
  watch: {
    question() { if (this.isGraded) this.attemptToSync(); }
  },
  components: { Draggable, InputError }
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
