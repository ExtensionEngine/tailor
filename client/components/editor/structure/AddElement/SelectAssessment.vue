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
import toArray from 'lodash/toArray';
import { typeInfo } from 'utils/assessment';

const ASSESSMENTS_PER_ROW = 6;
const EXTRA_TYPES = ['TR'];

const pullExtra = function (data) {
  return data.filter(it => !EXTRA_TYPES.includes(it.type));
};

export default {
  name: 'select-assessment',
  props: ['activity'],
  data() {
    return { assessments: typeInfo };
  },
  computed: {
    rows() {
      const data = this.activity === 'PERSPECTIVE'
        ? toArray(this.assessments)
        : pullExtra(toArray(this.assessments));
      return chunk(data, ASSESSMENTS_PER_ROW);
    },
    columnWidth() {
      return `col-xs-${12 / this.rows[0].length}`;
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
