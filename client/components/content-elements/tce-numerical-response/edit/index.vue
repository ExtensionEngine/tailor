<template>
  <div>
    <div class="subtitle-2 pb-2">{{ title }}</div>
    <v-row v-for="(answer, idx) in correct" :key="idx">
      <v-col cols="3">
        <v-text-field
          @input="updateAnswer('prefixes', $event, idx)"
          :disabled="disabled"
          :value="prefixes[idx]"
          :placeholder="prefixPlaceholder"
          color="blue-grey darken-3"
          filled />
      </v-col>
      <v-col :cols="canDelete ? 4 : 6" :md="canDelete ? 5 : 6">
        <v-text-field
          @input="updateAnswer('correct', $event, idx)"
          :value="correct[idx]"
          :disabled="disabled"
          :error="answerError(idx)"
          :placeholder="valuePlaceholder"
          color="blue-grey darken-3"
          filled />
      </v-col>
      <v-col cols="3">
        <v-text-field
          @input="updateAnswer('suffixes', $event, idx)"
          :value="suffixes[idx]"
          :disabled="disabled"
          :placeholder="suffixPlaceholder"
          color="blue-grey darken-3"
          filled />
      </v-col>
      <v-col v-if="canDelete" cols="2" md="1" class="mt-3 pl-1">
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
        text class="px-2">
        <v-icon small>mdi-plus</v-icon>
        {{ addButtonLabel }}
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

const TITLE = 'Answers';
const PREFIX_PLACEHOLDER = 'Prefix...';
const SUFFIX_PLACEHOLDER = 'Suffix...';
const VALUE_PLACEHOLDER = 'Correct value...';
const ADD_BUTTON_LABEL = 'Add answer';

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
    canDelete: vm => vm.isEditing && vm.correct.length > 1,
    addButtonLabel: () => ADD_BUTTON_LABEL,
    prefixPlaceholder: () => PREFIX_PLACEHOLDER,
    suffixPlaceholder: () => SUFFIX_PLACEHOLDER,
    valuePlaceholder: () => VALUE_PLACEHOLDER,
    title: () => TITLE
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

<style lang="scss" scoped>
::v-deep input {
  text-align: center;
}
</style>
