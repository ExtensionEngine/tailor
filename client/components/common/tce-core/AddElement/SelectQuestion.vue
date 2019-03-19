<template>
  <div class="select-question">
    <div
      v-for="(row, index) in rows"
      :key="index"
      class="row">
      <div
        v-for="{ name, subtype } in row"
        :key="subtype"
        :class="columnWidth"
        @click="$emit('selected', subtype)"
        class="btn-base question-type">
        <span>{{ name }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import chunk from 'lodash/chunk';

const QUESTIONS_PER_ROW = 6;

export default {
  name: 'select-question',
  props: {
    questions: { type: Array, default: () => [] },
    exclude: { type: Array, default: () => ([]) },
    rowSize: { type: Number, default: QUESTIONS_PER_ROW }
  },
  computed: {
    rows() {
      return chunk(this.elements, this.rowSize);
    },
    columns() {
      return Math.min(this.elements.length, this.rowSize);
    },
    elements() {
      const { exclude, questions } = this;
      if (!exclude.length) return questions;
      return questions.filter(it => !exclude.includes(it.type));
    },
    columnWidth() {
      return `col-xs-${Math.floor(12 / this.columns)}`;
    }
  }
};
</script>

<style lang="scss" scoped>
.select-question {
  max-width: 970px;
  margin: 20px auto;
  color: #444;

  .row {
    padding-bottom: 40px;
  }

  .btn-base {
    display: inline-block;
    font-size: 28px;
    line-height: 28px;
    vertical-align: middle;

    &:hover {
      color: #42b983;
      cursor: pointer;
    }
  }

  .question-type {
    font-size: 16px;
    line-height: 16px;
  }
}
</style>
