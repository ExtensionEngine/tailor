<template>
  <div class="form-group">
    <span class="form-label">Answers</span>
    <span
      v-if="isEditing"
      @click="addAnswer"
      class="btn-add-answer btn btn-link mdi mdi-plus pull-right">
    </span>
    <ul>
      <li
        v-for="(answer, index) in correct"
        :key="index"
        :class="{ 'has-error': isValidAnswer(index) }"
        class="answer row">
        <div class="col-xs-3">
          <input
            @input="updateAnswer('prefixes', $event.target.value, index)"
            :disabled="!isEditing"
            :value="prefixes[index]"
            type="text"
            placeholder="Prefix..."
            class="form-control">
        </div>
        <div :class="`col-xs-${ correct.length > 1 ? 5 : 6 }`">
          <input
            @input="updateAnswer('correct', $event.target.value, index)"
            :disabled="!isEditing"
            :value="correct[index]"
            type="text"
            placeholder="Correct value..."
            class="form-control">
        </div>
        <div class="col-xs-3">
          <input
            @input="updateAnswer('suffixes', $event.target.value, index)"
            :disabled="!isEditing"
            :value="suffixes[index]"
            type="text"
            placeholder="Suffix..."
            class="form-control">
        </div>
        <div
          v-if="isEditing && correct.length > 1"
          class="col-xs-1">
          <span
            @click="removeAnswer(index)"
            class="btn-remove mdi mdi-close">
          </span>
        </div>
      </li>
    </ul>
    <div :class="{ 'has-error': !isValid }">
      <span class="help-block">
        Only numerical input allowed, if decimal number is needed please
        use . to separate numbers (e.g. '3.14').
      </span>
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

.btn-add-answer {
  padding: 4px 10px;
  font-size: 20px;
  border-radius: 2px;
}

ul {
  padding: 0;
  list-style: none;
}

.answer {
  margin: 20px 0;
  font-size: 16px;

  .btn-remove {
    display: inline-block;
    height: 34px;
    color: #888;
    line-height: 34px;
    cursor: pointer;

    &:hover {
      color: darken(#888, 20%);
    }
  }
}

input.form-control {
  padding-left: 10px;
}

.help-block {
  margin-top: 30px;
}
</style>
