<template>
  <div>
    <div class="subtitle-2">{{ title }}</div>
    <v-card
      v-for="(groupName, groupKey, i) in groups" :key="groupKey"
      class="transparent elevation-0 pt-4">
      <div class="mb-4">
        <v-chip :color="color" text-color="white" label small>
          {{ i + 1 }}
        </v-chip>
        <v-btn
          v-if="isEditing && groupCount > 2"
          @click="removeGroup(groupKey)"
          :color="color"
          text
          small
          class="float-right px-2">
          <v-icon small>mdi-delete</v-icon>
          {{ deleteGroupLabel }}
        </v-btn>
      </div>
      <v-text-field
        @change="updateGroupName(groupKey, $event)"
        :value="groupName"
        :label="groupLabel"
        :disabled="disabled"
        :error="hasError(`groups${groupKey}`)"
        :color="color"
        filled />
      <v-text-field
        v-for="(answer, answerKey) in getAnswers(groupKey)"
        :key="answerKey"
        @change="updateAnswer(answerKey, $event)"
        :value="answer"
        :disabled="disabled"
        :placeholder="answerPlaceholder"
        :error="hasError(`answers${answerKey}`)"
        :color="color"
        filled>
        <template slot="append">
          <v-btn
            v-if="isEditing && answerCount(groupKey) > 1"
            @click="removeAnswer(groupKey, answerKey)"
            small icon>
            <v-icon small>mdi-close</v-icon>
          </v-btn>
        </template>
      </v-text-field>
      <div v-if="isEditing" class="d-flex justify-end mb-4">
        <v-btn
          @click="addAnswer(groupKey)"
          :color="color"
          text class="px-2">
          <v-icon small>mdi-plus</v-icon>
          {{ addAnswerLabel }}
        </v-btn>
      </div>
    </v-card>
    <div class="d-flex justify-center mb-4">
      <v-btn
        v-if="isEditing"
        @click="addGroup"
        :color="color"
        text class="px-2">
        <v-icon small>mdi-plus</v-icon>
        {{ addGroupLabel }}
      </v-btn>
    </div>
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep';
import cuid from 'cuid';
import { defaults } from 'utils/assessment';
import EventBus from 'EventBus';
import forEach from 'lodash/forEach';
import pick from 'lodash/pick';
import pull from 'lodash/pull';
import size from 'lodash/size';

const appChannel = EventBus.channel('app');

const TITLE = 'Answer groups';
const GROUP_LABEL = 'Group name...';
const ANSWER_PLACEHOLDER = 'Answer...';
const ADD_ANSWER_LABEL = 'Add answer';
const ADD_GROUP_LABEL = 'Add answer group';
const DELETE_GROUP_LABEL = 'Delete answer group';
const MODAL_OPTIONS = {
  title: 'Delete answer group',
  message: 'Are you sure you want to delete this answer group?'
};

export default {
  props: {
    assessment: { type: Object, default: defaults.DD },
    errors: { type: Array, default: () => ([]) },
    isEditing: { type: Boolean, default: false }
  },
  computed: {
    disabled: vm => !vm.isEditing,
    correct: vm => vm.assessment.correct,
    answers: vm => vm.assessment.answers,
    groups: vm => vm.assessment.groups,
    groupCount: vm => size(vm.groups),
    color: vm => vm.disabled ? 'grey' : 'blue-grey darken-3',
    title: () => TITLE,
    groupLabel: () => GROUP_LABEL,
    answerPlaceholder: () => ANSWER_PLACEHOLDER,
    addAnswerLabel: () => ADD_ANSWER_LABEL,
    addGroupLabel: () => ADD_GROUP_LABEL,
    deleteGroupLabel: () => DELETE_GROUP_LABEL
  },
  methods: {
    updateGroupName(groupKey, value) {
      const groups = cloneDeep(this.groups);
      groups[groupKey] = value;
      this.update({ groups });
    },
    getAnswers(groupKey) {
      const keys = this.correct[groupKey];
      return pick(this.answers, keys);
    },
    answerCount(groupKey) {
      return size(this.correct[groupKey]);
    },
    updateAnswer(answerKey, value) {
      const answers = cloneDeep(this.answers);
      answers[answerKey] = value;
      this.update({ answers });
    },
    addGroup() {
      const groups = cloneDeep(this.groups);
      const answers = cloneDeep(this.answers);
      const correct = cloneDeep(this.correct);
      const groupKey = cuid();
      const answerKey = cuid();
      groups[groupKey] = '';
      answers[answerKey] = '';
      correct[groupKey] = [answerKey];
      this.update({ groups, answers, correct });
    },
    addAnswer(groupKey) {
      const answers = cloneDeep(this.answers);
      const correct = cloneDeep(this.correct);
      const answerKey = cuid();
      answers[answerKey] = '';
      correct[groupKey].push(answerKey);
      this.update({ answers, correct });
    },
    removeAnswer(groupKey, answerKey) {
      const answers = cloneDeep(this.answers);
      const correct = cloneDeep(this.correct);
      delete answers[answerKey];
      correct[groupKey] = pull(correct[groupKey], answerKey);
      this.update({ answers, correct });
    },
    removeGroup(groupKey) {
      appChannel.emit('showConfirmationModal', {
        ...MODAL_OPTIONS,
        action: () => {
          const groups = cloneDeep(this.groups);
          const answers = cloneDeep(this.answers);
          const correct = cloneDeep(this.correct);
          forEach(correct[groupKey], answerKey => delete answers[answerKey]);
          delete groups[groupKey];
          delete correct[groupKey];
          this.update({ groups, answers, correct });
        }
      });
    },
    update(data) {
      this.$emit('update', data, true);
    },
    hasError(key) {
      return this.errors.includes(key);
    }
  }
};
</script>
