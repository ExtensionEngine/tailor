<template>
  <div>
    <v-row>
      <v-col v-for="(groupName, groupKey) in groups" :key="groupKey" cols="6">
        <v-text-field
          @change="updateGroupName(groupKey, $event)"
          :value="groupName"
          :color="color"
          :disabled="disabled"
          :placeholder="groupPlaceholder"
          :error="hasError(`groups${groupKey}`)">
          <template slot="append">
            <v-btn
              v-if="isEditing && groupCount > 2"
              @click="removeGroup(groupKey)"
              small icon>
              <v-icon small>mdi-delete</v-icon>
            </v-btn>
          </template>
        </v-text-field>
        <v-text-field
          v-for="(answer, answerKey) in getAnswers(groupKey)"
          :key="answerKey"
          @change="updateAnswer(answerKey, $event)"
          :color="color"
          :value="answer"
          :disabled="disabled"
          :placeholder="answerPlaceholder"
          :error="hasError(`answers${answerKey}`)"
          hide-details filled class="my-2">
          <template slot="append">
            <v-btn
              v-if="isEditing && answerCount(groupKey) > 1"
              @click="removeAnswer(groupKey, answerKey)"
              small icon>
              <v-icon small>mdi-close</v-icon>
            </v-btn>
          </template>
        </v-text-field>
        <div class="text-center">
          <v-btn
            v-if="isEditing"
            @click="addAnswer(groupKey)"
            small icon class="my-2">
            <v-icon small>mdi-plus</v-icon>
          </v-btn>
        </div>
      </v-col>
    </v-row>
    <div class="d-flex justify-center">
      <v-btn v-if="isEditing" @click="addGroup" text class="px-2">
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
import forEach from 'lodash/forEach';
import pick from 'lodash/pick';
import pull from 'lodash/pull';
import size from 'lodash/size';

const GROUP_PLACEHOLDER = 'Group';
const ANSWER_PLACEHOLDER = 'Answer';
const ADD_GROUP_LABEL = 'Add group';

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
    groupPlaceholder: () => GROUP_PLACEHOLDER,
    answerPlaceholder: () => ANSWER_PLACEHOLDER,
    addGroupLabel: () => ADD_GROUP_LABEL
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
      const groups = cloneDeep(this.groups);
      const answers = cloneDeep(this.answers);
      const correct = cloneDeep(this.correct);
      forEach(correct[groupKey], answerKey => delete answers[answerKey]);
      delete groups[groupKey];
      delete correct[groupKey];
      this.update({ groups, answers, correct });
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

<style lang="scss" scoped>
::v-deep input {
  text-align: center;
}
</style>
