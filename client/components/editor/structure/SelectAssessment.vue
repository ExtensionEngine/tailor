<template>
  <div class="select-assessment">
    <div class="btn-base assessment-type"
      v-if="selection"
      v-for="assessment in assessments"
      @click="select(assessment)">
      <span>{{ assessment.title }}</span>
    </div>
    <div class="btn-base" v-if="!selection" @click="selection = !selection">
      <span class="fa fa-plus"></span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'select-assessment',
  data() {
    return {
      selection: false,
      assessments: [
        { type: 'MC', title: 'Multiple Choice' }
      ]
    };
  },
  methods: {
    select(assessment) {
      this.$emit('selected', assessment.type);
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
    font-size: 28px;
    line-height: 28px;
    vertical-align: top;

    &:hover {
      color: #42b983;
      cursor: pointer;
    }
  }

  .btn-close {
    display: inline-block;
    margin: 3px 0px 0px 20px;
    color: #333;
  }

  .assessment-type {
    font-size: 16px;
    line-height: 16px;
  }
}
</style>
