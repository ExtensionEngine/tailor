<template>
  <div>
    <div class="subtitle-2 pb-2">Answers</div>
    <v-row v-for="(answer, idx) in correct" :key="idx">
      <v-col cols="3">
        <v-text-field
          @input="updateAnswer('prefixes', $event, idx)"
          :value="prefixes[idx]"
          :disabled="disabled"
          placeholder="Prefix..."
          color="blue-grey darken-3"
          filled />
      </v-col>
      <v-col :cols="canRemoveAnswer ? 4 : 6" :md="canRemoveAnswer ? 5 : 6">
        <v-text-field
          @input="updateAnswer('correct', $event, idx)"
          :value="correct[idx]"
          :error="answerError(idx)"
          :disabled="disabled"
          placeholder="Correct value..."
          color="blue-grey darken-3"
          filled />
      </v-col>
      <v-col cols="3">
        <v-text-field
          @input="updateAnswer('suffixes', $event, idx)"
          :value="suffixes[idx]"
          :disabled="disabled"
          placeholder="Suffix..."
          color="blue-grey darken-3"
          filled />
      </v-col>
      <v-col v-if="canRemoveAnswer" cols="2" md="1" class="mt-3 pl-1">
        <v-btn
          @click="removeAnswer(idx)"
          :disabled="disabled"
          icon>
          <v-icon small>mdi-delete</v-icon>
        </v-btn>
      </v-col>
    </v-row>
    <div class="d-flex justify-end">
      <v-btn
        v-if="isEditing"
        @click="addAnswer"
        color="blue-grey darken-3"
        text
        class="px-2">
        <v-icon small>mdi-plus</v-icon>
        Add answer
      </v-btn>
    </div>
    <v-alert
      v-if="correctError"
      type="error"
      color="red darken-4"
      prominent text
      class="mt-5">
      Only numerical input allowed, if decimal number is needed please
      use . to separate numbers (e.g. '3.14').
    </v-alert>
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep';
import { defaults } from 'utils/assessment';
import get from 'lodash/get';
import includes from 'lodash/includes';
import last from 'lodash/last';
import pullAt from 'lodash/pullAt';
import some from 'lodash/some';
import startsWith from 'lodash/startsWith';
import toNumber from 'lodash/toNumber';

const startsWithCorrect = it => startsWith(it, 'correct');

export default {
  props: {
    assessment: { type: Object, default: defaults.NR },
    errors: { type: Array, default: () => ([]) },
    isEditing: { type: Boolean, default: false }
  },
  computed: {
    disabled: vm => !vm.isEditing,
    correct: vm => get(vm.assessment, 'correct', []),
    prefixes: vm => get(vm.assessment, 'prefixes', []),
    suffixes: vm => get(vm.assessment, 'suffixes', []),
    correctError: vm => some(vm.errors, startsWithCorrect),
    canRemoveAnswer: vm => vm.isEditing && vm.correct.length > 1
  },
  methods: {
    addAnswer() {
      const { correct, prefixes, suffixes } = cloneDeep(this.assessment);
      prefixes.push('');
      suffixes.push('');
      correct.push('');
      this.update({ prefixes, suffixes, correct });
    },
    updateAnswer(name, value, index) {
      if (name === 'correct') {
        if (last(value) === '.') return;
        value = toNumber(value) || value;
      }
      const values = cloneDeep(this[name]);
      values[index] = value;
      this.update({ [name]: values });
    },
    removeAnswer(index) {
      if (this.correct.length <= 1) return;
      const { correct, prefixes, suffixes } = cloneDeep(this.assessment);
      pullAt(prefixes, index);
      pullAt(suffixes, index);
      pullAt(correct, index);
      this.update({ prefixes, suffixes, correct });
    },
    answerError(index) {
      return includes(this.errors, `correct[${index}]`);
    },
    update(data) {
      this.$emit('update', data, true);
    }
  }
};
</script>
