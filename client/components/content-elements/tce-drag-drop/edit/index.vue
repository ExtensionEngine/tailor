<template>
  <div :class="['drag-drop', { disabled }]">
    <v-row>
      <v-col
        v-for="(groupName, groupKey) in groups"
        :key="groupKey"
        cols="6">
        <v-text-field
          @change="updateGroupName(groupKey, $event)"
          :value="groupName"
          :error="hasError(`groups${groupKey}`)"
          placeholder="Group">
          <template slot="append">
            <v-btn @click="removeGroup(groupKey)" small icon tile>
              <v-icon small>mdi-close</v-icon>
            </v-btn>
          </template>
        </v-text-field>
        <v-text-field
          v-for="(answer, answerKey) in getGroupAnswers(groupKey)"
          :key="answerKey"
          @change="updateAnswer(answerKey, $event)"
          :value="answer"
          :error="hasError(`answers${answerKey}`)"
          placeholder="Answer">
          <template slot="append">
            <v-btn @click="removeAnswer(groupKey, answerKey)" small icon tile>
              <v-icon small>mdi-close</v-icon>
            </v-btn>
          </template>
        </v-text-field>
        <v-btn @click="addAnswer(groupKey)" :disabled="disabled" small icon>
          <v-icon small>mdi-plus</v-icon>
        </v-btn>
      </v-col>
    </v-row>
    <v-btn @click="addGroup" :disabled="disabled">
      <v-icon small>mdi-plus</v-icon> Add Group
    </v-btn>
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep';
import cuid from 'cuid';
import { defaults } from 'utils/assessment';
import forEach from 'lodash/forEach';
import pick from 'lodash/pick';
import pull from 'lodash/pull';

export default {
  props: {
    assessment: { type: Object, default: defaults.DD },
    isEditing: { type: Boolean, default: false },
    errors: { type: Array, default: () => ([]) }
  },
  data() {
    return {
      focused: { groupKey: null, answerKey: null }
    };
  },
  computed: {
    disabled: vm => !vm.isEditing,
    groups: vm => vm.assessment.groups || {},
    answers: vm => vm.assessment.answers || {},
    correct: vm => vm.assessment.correct || {}
  },
  methods: {
    getGroupAnswers(groupKey) {
      const keys = this.correct[groupKey] || [];
      return pick(this.answers, keys);
    },
    updateGroupName(groupKey, value) {
      const groups = cloneDeep(this.groups);
      groups[groupKey] = value;
      this.update({ groups }, true);
    },
    updateAnswer(answerKey, value) {
      const answers = cloneDeep(this.answers);
      answers[answerKey] = value;
      this.update({ answers }, true);
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
    minGroups(groupKey) {
      return Object.keys(this.groups).length <= 2;
    },
    minAnswers(groupKey) {
      return this.correct[groupKey].length <= 1;
    },
    focus(groupKey, answerKey) {
      this.focused = this.isFocused(groupKey, answerKey)
        ? {}
        : { groupKey, answerKey };
    },
    isFocused(groupKey, answerKey) {
      const state = this.focused;
      return state.groupKey === groupKey && state.answerKey === answerKey;
    },
    removeAnswer(groupKey, answerKey) {
      const answers = cloneDeep(this.answers);
      const correct = cloneDeep(this.correct);
      delete answers[answerKey];
      correct[groupKey] = pull(correct[groupKey], answerKey);
      this.update({ answers, correct });
    },
    removeGroup(groupKey) {
      const groups = cloneDeep(this.groups);
      const answers = cloneDeep(this.answers);
      const correct = cloneDeep(this.correct);
      forEach(correct[groupKey], answerKey => delete answers[answerKey]);
      delete groups[groupKey];
      delete correct[groupKey];
      this.update({ groups, answers, correct });
    },
    hasError(key) {
      return this.errors.includes(key);
    },
    update(data) {
      this.$emit('update', data, true);
    }
  }
};
</script>

<style lang="scss" scoped>
.drag-drop ::v-deep input {
  text-align: center;
}

.disabled {
  pointer-events: none;
}
</style>
