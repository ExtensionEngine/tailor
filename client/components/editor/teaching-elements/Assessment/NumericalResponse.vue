<template>
  <div class="form-group">
    <span class="form-label">Answers</span>
    <span
      v-if="isEditing"
      @click="addAnswer"
      class="btn-add-answer btn btn-link mdi mdi-plus pull-right">
    </span>
    <ul >
      <li
        v-for="(answer, index) in answers"
        :class="{ 'has-error': isValidAnswer(index) }"
        class="answer row">
        <div class="col-xs-3">
          <input
            :disabled="!isEditing"
            :value="prefixes[index]"
            @input="updateAnswer('prefixes', $event.target.value, index)"
            type="text"
            placeholder="Prefix..."
            class="form-control">
        </div>
        <div class="col-xs-5">
          <input
            :disabled="!isEditing"
            :value="correct[index]"
            @input="updateAnswer('correct', $event.target.value, index)"
            type="text"
            placeholder="Correct value..."
            class="form-control">
        </div>
        <div class="col-xs-3">
          <input
            :disabled="!isEditing"
            :value="suffixes[index]"
            @input="updateAnswer('suffixes', $event.target.value, index)"
            type="text"
            placeholder="Suffix..."
            class="form-control">
        </div>
        <div class="col-xs-1">
          <span
            v-if="isEditing && answers.length > 1"
            @click="removeAnswer(index)"
            class="btn-remove mdi mdi-close">
          </span>
        </div>
      </li>
    </ul>
    <div :class="{ 'has-error': !isValid }">
      <span class="help-block">
        Only numerical input allowed, if decimal number is needed please
        use '.' to separate numbers (e.g. '3.14').
      </span>
    </div>
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep';
import find from 'lodash/find';
import get from 'lodash/get';
import includes from 'lodash/includes';
import pullAt from 'lodash/pullAt';
import startsWith from 'lodash/startsWith';

export default {
  props: {
    assessment: Object,
    errors: Array,
    isEditing: Boolean
  },
  computed: {
    isValid() {
      return !find(this.errors, err => startsWith(err, 'correct'));
    },
    answers() {
      return get(this.assessment, 'answers', []);
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
      let { answers, correct, prefixes, suffixes } = cloneDeep(this.assessment);
      answers.push('');
      prefixes.push('');
      suffixes.push('');
      correct.push('');
      this.update({ answers, prefixes, suffixes, correct });
    },
    updateAnswer(name, value, index) {
      let values = cloneDeep(this[name]);
      if (name === 'correct') value = Number(value) || value;
      values[index] = value;
      this.update({ [name]: values });
    },
    removeAnswer(index) {
      if (this.answers.length <= 1) return;
      let { answers, correct, prefixes, suffixes } = cloneDeep(this.assessment);
      pullAt(answers, index);
      pullAt(prefixes, index);
      pullAt(suffixes, index);
      pullAt(correct, index);
      this.update({ answers, prefixes, suffixes, correct });
    },
    update(data) {
      this.$emit('update', data, true /* validate */);
    }
  },
  watch: {
    isEditing(newVal) {
      if (!newVal) this.correct = this.assessment.correct;
    }
  }
};
</script>

<style lang="scss" scoped>
.form-group {
  text-align: left;
  margin: 0 auto;
  padding: 25px 20px 15px 20px;
  width: 100%;
  overflow: hidden;
}

.form-label {
  display: inline-block;
  padding: 5px;
  font-size: 20px;
}

.btn-add-answer {
  font-size: 20px;
  padding: 4px 10px;
  border-radius: 2px;
}

ul {
  padding: 0;
  list-style: none;
}

.answer {
  font-size: 16px;
  margin: 20px 0;

  .btn-remove {
    display: inline-block;
    height: 34px;
    line-height: 34px;
    cursor: pointer;
    color: #888;

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
