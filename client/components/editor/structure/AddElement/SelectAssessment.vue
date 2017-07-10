<template>
  <div class="select-assessment">
    <div v-for="row in rows" class="row">
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
import filter from 'lodash/filter';
import includes from 'lodash/includes';
import isArray from 'lodash/isArray';
import toArray from 'lodash/toArray';
import { typeInfo } from 'utils/assessment';

const ASSESSMENTS_PER_ROW = 6;
const assessments = toArray(typeInfo);
const arrify = arg => isArray(arg) ? arg : [arg];

export default {
  name: 'select-assessment',
  props: ['exclude'],
  computed: {
    rows() {
      return chunk(this.elements, ASSESSMENTS_PER_ROW);
    },
    elements() {
      if (!this.exclude) return assessments;
      const exclude = arrify(this.exclude);
      return filter(assessments, it => !includes(exclude, it.type));
    },
    columnWidth() {
      return `col-xs-${12 / ASSESSMENTS_PER_ROW}`;
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
