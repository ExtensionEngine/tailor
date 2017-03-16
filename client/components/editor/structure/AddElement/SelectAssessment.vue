<template>
  <div class="select-assessment">
    <div
      v-for="assessment in assessments"
      @click="$emit('selected', assessment.type)"
      class="btn-base assessment-type">
      <span>{{ assessment.title }}</span>
    </div>
  </div>
</template>

<script>
import { typeInfo } from 'utils/assessment';

export default {
  name: 'select-assessment',
  data() {
    return { assessments: typeInfo };
  }
};
</script>

<style lang="scss" scoped>
.select-assessment {
  margin: 15px 0;
  color: #444;

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
    margin: 0 15px;
    font-size: 16px;
    line-height: 16px;
  }
}
</style>
