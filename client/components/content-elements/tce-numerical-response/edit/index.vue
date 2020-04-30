<template>
  <v-container class="px-0 pr-12">
    <div class="subtitle-2">Answers</div>
    <v-row v-for="(answer, idx) in correct" :key="idx" class="pr-2">
      <v-col cols="3">
        <v-text-field
          @input="updateAnswer('prefixes', $event, idx)"
          :disabled="disabled"
          :value="prefixes[idx]"
          :color="color"
          :placeholder="prefixPlaceholder"
          filled clearable />
      </v-col>
      <v-col :cols="correct.length > 1 ? 5 : 6">
        <v-text-field
          @input="updateAnswer('correct', $event, idx)"
          :value="correct[idx]"
          :color="color"
          :disabled="disabled"
          :error="answerError(idx)"
          :placeholder="valuePlaceholder"
          filled clearable />
      </v-col>
      <v-col cols="3">
        <v-text-field
          @input="updateAnswer('suffixes', $event, idx)"
          :value="suffixes[idx]"
          :color="color"
          :disabled="disabled"
          :placeholder="suffixPlaceholder"
          filled clearable />
      </v-col>
      <v-col v-if="correct.length > 1" cols="1">
        <v-btn
          v-if="isEditing"
          @click="removeAnswer(idx)"
          :disabled="disabled"
          icon
          class="my-3">
          <v-icon small>mdi-close</v-icon>
        </v-btn>
      </v-col>
    </v-row>
    <div class="d-flex">
      <v-spacer />
      <v-btn
        @click="addAnswer"
        :disabled="disabled"
        color="blue-grey darken-4"
        text>
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
  </v-container>
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

const PREFIX_PLACEHOLDER = 'Prefix...';
const SUFFIX_PLACEHOLDER = 'Suffix...';
const VALUE_PLACEHOLDER = 'Correct value...';

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
    color: vm => vm.disabled ? 'grey' : 'blue-grey darken-3',
    prefixPlaceholder: () => PREFIX_PLACEHOLDER,
    suffixPlaceholder: () => SUFFIX_PLACEHOLDER,
    valuePlaceholder: () => VALUE_PLACEHOLDER
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
