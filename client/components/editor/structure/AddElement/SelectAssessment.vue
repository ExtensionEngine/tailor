<template>
  <div :style="{ 'max-width': maxWidth + 'px' }" class="select-assessment">
    <div v-for="(row, index) in rows" :key="row[index].type" class="row">
      <div
        v-for="assessment in row"
        :key="assessment.type"
        :class="columnWidth"
        @click="$emit('selected', assessment.type)"
        class="btn-base assessment-type">
        <span>{{ assessment.title }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import chunk from 'lodash/chunk';
import toArray from 'lodash/toArray';
import { typeInfo } from 'utils/assessment';

const ASSESSMENTS_PER_ROW = 6;

export default {
  name: 'select-assessment',
  data() {
    return { assessments: typeInfo };
  },
  computed: {
    rows() {
      return chunk(toArray(this.assessments), ASSESSMENTS_PER_ROW);
    },
    columnWidth() {
      return `col-xs-${12 / this.rows[0].length}`;
    },
    maxWidth() {
      // Set the maximum width of the select component container in the
      // increments of 150px, with the baseline of 2 elements having 200px width
      return 200 + (this.rows[0].length - 2) * 150;
    }
  }
};
</script>

<style lang="scss" scoped>
.select-assessment {
  margin: 0 auto;
  color: #444;

  .row {
    padding-bottom: 12px;
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
