<template>
  <div class="form-group">
    <span class="form-label">Answers</span>
    <v-btn v-if="isEditing" @click="addAnswer" icon class="float-right">
      <v-icon small>mdi-plus</v-icon>
    </v-btn>
    <v-container>
      <v-row
        v-for="(answer, index) in correct"
        :key="index"
        class="answer">
        <v-col cols="3">
          <v-text-field
            @change="updateAnswer('prefixes', $event, index)"
            :disabled="!isEditing"
            :value="prefixes[index]"
            :error="isValidAnswer(index)"
            hide-details
            single-line
            placeholder="Prefix..." />
        </v-col>
        <v-col :cols="correct.length > 1 ? 5 : 6">
          <v-text-field
            @change="updateAnswer('correct', $event, index)"
            :disabled="!isEditing"
            :value="correct[index]"
            :error="isValidAnswer(index)"
            hide-details
            single-line
            placeholder="Correct value..." />
        </v-col>
        <v-col cols="3">
          <v-text-field
            @change="updateAnswer('suffixes', $event, index)"
            :disabled="!isEditing"
            :value="suffixes[index]"
            :error="isValidAnswer(index)"
            hide-details
            single-line
            placeholder="Suffix..." />
        </v-col>
        <v-col
          v-if="isEditing && correct.length > 1"
          cols="1">
          <v-btn @click="removeAnswer(index)" icon small>
            <v-icon small>mdi-close</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
    <div class="help-block" :class="{ 'red--text': !isValid }">
      Only numerical input allowed, if decimal number is needed please
      use . to separate numbers (e.g. '3.14').
    </div>
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep';
import { defaults } from 'utils/assessment';
import find from 'lodash/find';
import get from 'lodash/get';
import includes from 'lodash/includes';
import last from 'lodash/last';
import pullAt from 'lodash/pullAt';
import startsWith from 'lodash/startsWith';
import toNumber from 'lodash/toNumber';

export default {
  props: {
    assessment: { type: Object, default: defaults.NR },
    errors: { type: Array, default: () => ([]) },
    isEditing: { type: Boolean, default: false }
  },
  computed: {
    isValid() {
      return !find(this.errors, err => startsWith(err, 'correct'));
    },
    correct() {
      return get(this.assessment, 'correct', []);
    },
    prefixes() {
      return get(this.assessment, 'prefixes', []);
    },
    suffixes() {
      return get(this.assessment, 'suffixes', []);
    }
  },
  methods: {
    isValidAnswer(index) {
      return includes(this.errors, `correct[${index}]`);
    },
    addAnswer() {
      let { correct, prefixes, suffixes } = cloneDeep(this.assessment);
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
      let values = cloneDeep(this[name]);
      values[index] = value;
      this.update({ [name]: values });
    },
    removeAnswer(index) {
      if (this.correct.length <= 1) return;
      let { correct, prefixes, suffixes } = cloneDeep(this.assessment);
      pullAt(prefixes, index);
      pullAt(suffixes, index);
      pullAt(correct, index);
      this.update({ prefixes, suffixes, correct });
    },
    update(data) {
      this.$emit('update', data, true /* validate */);
    }
  }
};
</script>

<style lang="scss" scoped>
.form-group {
  width: 100%;
  margin: 0 auto;
  padding: 25px 20px 15px;
  text-align: left;
  overflow: hidden;
}

.form-label {
  display: inline-block;
  padding: 5px;
  font-size: 20px;
}

.v-text-field {
  margin: 0;
  padding: 0;
}

.answer {
  font-size: 16px;
}

input.form-control {
  padding-left: 10px;
}

.help-block {
  margin-top: 30px;
  color: gray;
}
</style>
