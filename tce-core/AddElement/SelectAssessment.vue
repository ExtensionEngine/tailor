<template>
  <div class="select-assessment">
    <div
      v-for="(row, index) in rows"
      :key="index"
      class="row">
      <div
        v-for="{ name, subtype } in row"
        :key="subtype"
        :class="columnWidth"
        @click="$emit('selected', subtype)"
        class="btn-base assessment-type">
        <span>{{ name }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import chunk from 'lodash/chunk';

const ASSESSMENTS_PER_ROW = 6;

export default {
  name: 'select-assessment',
  props: {
    assessments: { type: Array, default: () => [] },
    exclude: { type: Array, default: () => ([]) },
    rowSize: { type: Number, default: ASSESSMENTS_PER_ROW }
  },
  computed: {
    rows() {
      return chunk(this.elements, this.rowSize);
    },
    columns() {
      return Math.min(this.elements.length, this.rowSize);
    },
    elements() {
      const { exclude, assessments } = this;
      if (!exclude.length) return assessments;
      return assessments.filter(it => !exclude.includes(it.type));
    },
    columnWidth() {
      return `col-xs-${12 / this.columns}`;
    }
  }
};
</script>

<style lang="scss" scoped>
.select-assessment {
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

  .assessment-type {
    font-size: 16px;
    line-height: 16px;
  }
}
</style>
