<template>
  <div class="numerical-response">
    <span class="title">Answers</span>
    <v-btn
      @click="addAnswer"
      :disabled="disabled"
      small icon tile class="float-right">
      <v-icon small>mdi-plus</v-icon>
    </v-btn>
    <v-row v-for="(answer, idx) in correct" :key="idx">
      <v-col cols="3">
        <v-text-field
          @input="updateAnswer('prefixes', $event, idx)"
          :disabled="disabled"
          :value="prefixes[idx]"
          placeholder="Prefix..."
          hide-details />
      </v-col>
      <v-col :cols="correct.length > 1 ? 5 : 6">
        <v-text-field
          @input="updateAnswer('correct', $event, idx)"
          :disabled="disabled"
          :value="correct[idx]"
          :error="answerError(idx)"
          placeholder="Correct value..."
          hide-details />
      </v-col>
      <v-col cols="3">
        <v-text-field
          @input="updateAnswer('suffixes', $event, idx)"
          :disabled="disabled"
          :value="suffixes[idx]"
          placeholder="Suffix..."
          hide-details />
      </v-col>
      <v-col cols="1" class="controls">
        <v-btn
          v-if="isEditing && correct.length > 1"
          @click="removeAnswer(idx)"
          :disabled="disabled"
          small icon tile>
          <v-icon small>mdi-close</v-icon>
        </v-btn>
      </v-col>
    </v-row>
    <div v-if="correctError">
      <span>
        Only numerical input allowed, if decimal number is needed please
        use . to separate numbers (e.g. '3.14').
      </span>
    </div>
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
    correctError: vm => some(vm.errors, startsWithCorrect)
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
.numerical-response {
  width: 100%;
  padding: 1.5rem 1.25rem 1rem;
  text-align: left;
  overflow: hidden;

  .title {
    font-weight: 400;
  }

  .controls {
    display: flex;
    align-items: flex-end;
  }
}

.help-block {
  margin-top: 30px;
}
</style>
