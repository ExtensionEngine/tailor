<template>
  <div class="assessments">
    <h2>Assessments</h2>
    <ul class="list-group">
      <assessment-item
        v-for="assessment in assessments"
        :assessment="assessment"
        :edit="isSelected(assessment)"
        @selected="select(assessment)">
      </assessment-item>
    </ul>
    <select-assessment @selected="add"></select-assessment>
  </div>
</template>

<script>
import cuid from 'cuid';
import AssessmentItem from './AssessmentItem';
import SelectAssessment from './SelectAssessment';

export default {
  name: 'assessments',
  data() {
    return {
      selected: null,
      assessments: [
        { _cid: '123', type: 'MC', title: 'Very questionable question ?' },
        { _cid: '423', type: 'MC', title: 'Another questionable question ?' }
      ]
    };
  },
  methods: {
    add(type) {
      const _cid = cuid();
      this.assessments.push({ _cid, type });
      this.selected = _cid;
    },
    select(assessment) {
      this.selected = assessment._cid;
    },
    isSelected(assessment) {
      return this.selected === assessment._cid;
    }
  },
  components: {
    AssessmentItem,
    SelectAssessment
  }
};
</script>

<style lang="scss" scoped>
.assessments {
  margin: 70px 0;

  h2 {
    margin-bottom: 15px;
    font-size: 20px;
    color: #444;
  }
}
</style>
