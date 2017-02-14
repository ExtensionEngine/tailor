<template>
  <div class="select-assessment">
    <div v-if="selection">
      <div class="btn-base assessment-type"
        v-for="assessment in assessments"
        @click="select(assessment)">
        <span>{{ assessment.title }}</span>
      </div>
      <div class="btn-base btn-close" @click="selection = false">
        <span class="fa fa-close"></span>
      </div>
    </div>
    <div class="btn-base" v-if="!selection" @click="selection = !selection">
      <span class="fa fa-plus"></span>
    </div>
  </div>
</template>

<script>
import { defaults, typeInfo } from '../../../utils/assessment';

export default {
  name: 'select-assessment',
  data() {
    return {
      selection: false,
      assessments: typeInfo
    };
  },
  methods: {
    select(assessment) {
      this.$emit('selected', defaults[assessment.type]);
      this.selection = false;
    }
  }
};
</script>

<style lang="scss">
.select-assessment {
  margin: 20px 0;
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

  .btn-close {
    display: inline-block;
    margin-left: 20px;
    color: #333;
  }

  .assessment-type {
    font-size: 16px;
    line-height: 16px;
    margin: 0 15px;
  }
}
</style>
