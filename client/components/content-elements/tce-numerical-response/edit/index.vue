<template>
  <div>
    <div class="subtitle-2 pb-2">Answers</div>
    <v-row v-for="(answer, idx) in correct" :key="idx">
      <v-col cols="3">
        <v-text-field
          @input="updateAnswer('prefixes', $event, idx)"
          :value="prefixes[idx]"
          :disabled="disabled"
          :error-messages="prefixErrors(idx)"
          placeholder="Prefix..."
          color="primary darken-3"
          filled />
      </v-col>
      <v-col :cols="canRemoveAnswer ? 4 : 6" :md="canRemoveAnswer ? 5 : 6">
        <v-text-field
          @input="updateAnswer('correct', $event, idx)"
          :value="correct[idx]"
          :error-messages="correctErrors(idx)"
          :disabled="disabled"
          placeholder="Correct value..."
          color="primary darken-3"
          filled />
      </v-col>
      <v-col cols="3">
        <v-text-field
          @input="updateAnswer('suffixes', $event, idx)"
          :value="suffixes[idx]"
          :disabled="disabled"
          :error-messages="suffixErrors(idx)"
          placeholder="Suffix..."
          color="primary darken-3"
          filled />
      </v-col>
      <v-col v-if="canRemoveAnswer" cols="2" md="1" class="mt-3 pl-1">
        <v-btn
          @click="removeAnswer(idx)"
          :disabled="disabled"
          icon>
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </v-col>
    </v-row>
    <div class="d-flex justify-end">
      <v-btn
        v-if="isEditing"
        @click="addAnswer"
        color="grey darken-4"
        text
        class="mb-2 px-2">
        <v-icon>mdi-plus</v-icon>
        Add answer
      </v-btn>
    </div>
  </div>
</template>

<script>
import { assessment } from '@extensionengine/tce-utils';
import cloneDeep from 'lodash/cloneDeep';
import get from 'lodash/get';
import last from 'lodash/last';
import pullAt from 'lodash/pullAt';
import toNumber from 'lodash/toNumber';

export default {
  props: {
    assessment: { type: Object, default: assessment.defaults.NR },
    errors: { type: Array, default: () => ([]) },
    isEditing: { type: Boolean, default: false }
  },
  computed: {
    disabled: vm => !vm.isEditing,
    correct: vm => get(vm.assessment, 'correct', []),
    prefixes: vm => get(vm.assessment, 'prefixes', []),
    suffixes: vm => get(vm.assessment, 'suffixes', []),
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
    correctErrors(index) {
      return assessment.getErrorMessages(this.errors, `correct[${index}]`);
    },
    prefixErrors(index) {
      return assessment.getErrorMessages(this.errors, `prefixes[${index}]`);
    },
    suffixErrors(index) {
      return assessment.getErrorMessages(this.errors, `suffixes[${index}]`);
    },
    update(data) {
      this.$emit('update', data);
    }
  }
};
</script>
