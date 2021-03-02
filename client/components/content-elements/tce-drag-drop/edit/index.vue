<template>
  <div>
    <div class="subtitle-2">Answer groups</div>
    <v-card
      v-for="(groupName, groupKey, i) in groups" :key="groupKey"
      class="pt-4 transparent elevation-0">
      <div class="mb-4">
        <v-chip
          :color="color"
          label dark small
          class="readonly">
          {{ i + 1 }}
        </v-chip>
        <v-btn
          v-if="isEditing && groupCount > 2"
          @click="removeGroup(groupKey)"
          :color="color"
          text small
          class="ml-1 px-2">
          Remove answer group
        </v-btn>
      </div>
      <v-text-field
        @change="updateGroupName(groupKey, $event)"
        :value="groupName"
        :error-messages="errorMessages(groupKey)"
        :disabled="disabled"
        :color="color"
        label="Group name"
        filled />
      <v-text-field
        v-for="(answer, answerKey) in getAnswers(groupKey)"
        :key="answerKey"
        @change="updateAnswer(answerKey, $event)"
        :value="answer"
        :error-messages="errorMessages(answerKey)"
        :disabled="disabled"
        :color="color"
        placeholder="Answer..."
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
      <div v-if="isEditing" class="mb-4 d-flex justify-end">
        <v-btn
          @click="addAnswer(groupKey)"
          :color="color"
          text
          class="px-2">
          <v-icon dense class="mr-1">mdi-plus</v-icon>
          Add answer
        </v-btn>
      </div>
    </v-card>
    <div class="d-flex justify-center mb-4">
      <v-btn
        v-if="isEditing"
        @click="addGroup"
        :color="color"
        text
        class="px-2">
        <v-icon dense class="mr-1">mdi-plus</v-icon>
        Add answer group
      </v-btn>
    </div>
  </div>
</template>

<script>
import { assessment } from '@extensionengine/tce-utils';
import cloneDeep from 'lodash/cloneDeep';
import cuid from 'cuid';
import forEach from 'lodash/forEach';
import { mapRequests } from '@extensionengine/vue-radio';
import pick from 'lodash/pick';
import pull from 'lodash/pull';
import size from 'lodash/size';

export default {
  props: {
    assessment: { type: Object, default: assessment.defaults.DD },
    errors: { type: Array, default: () => ([]) },
    isEditing: { type: Boolean, default: false }
  },
  computed: {
    disabled: vm => !vm.isEditing,
    correct: vm => vm.assessment.correct,
    answers: vm => vm.assessment.answers,
    groups: vm => vm.assessment.groups,
    groupCount: vm => size(vm.groups),
    color: vm => vm.disabled ? 'grey' : 'grey darken-3'
  },
  methods: {
    ...mapRequests('app', ['showConfirmationModal']),
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
      this.showConfirmationModal({
        title: 'Delete answer group',
        message: 'Are you sure you want to delete this answer group?',
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
      this.$emit('update', data);
    },
    errorMessages(key) {
      return assessment.getErrorMessages(this.errors, key);
    }
  }
};
</script>
