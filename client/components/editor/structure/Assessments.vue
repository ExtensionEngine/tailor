<template>
  <div class="assessments">
    <h2>Assessments</h2>
    <ul class="list-group">
      <assessment-item
        v-for="assessment in assessments"
        :assessment="assessment"
        :edit="isSelected(assessment)"
        @selected="toggleSelect(assessment)"
        @saveAssessment="saveAssessment"
        @remove="remove(assessment)">
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
      selected: [],
      assessments: {
        '123': {
          _cid: '123',
          type: 'MC',
          question: 'What are two biggest cities in Croatia ?',
          answers: ['Zagreb', 'Split', 'Rijeka'],
          correct: [0, 1],
          hint: ''
        },
        '423': {
          _cid: '423',
          type: 'MC',
          question: 'What are two biggest cities in USA ?',
          answers: ['NY', 'Los Angeles', 'San Francisco'],
          correct: [0, 2],
          hint: ''
        }
      }
    };
  },
  methods: {
    add(type) {
      const _cid = cuid();
      this.assessments[_cid] = { _cid: _cid, type: type };
      this.selected.push(_cid);
    },
    toggleSelect(assessment) {
      if (this.selected.includes(assessment._cid) && !this.assessments[assessment._cid].question) {
        this.remove(assessment);
      } else if (this.selected.includes(assessment._cid)) {
        this.selected.splice(this.selected.indexOf(assessment._cid), 1);
      } else {
        this.selected.push(assessment._cid);
      }
    },
    isSelected(assessment) {
      return this.selected.includes(assessment._cid);
    },
    saveAssessment(assessment) {
      if (this.assessments[assessment._cid]) {
        this.assessments[assessment._cid] = assessment;
      }
    },
    remove(assessment) {
      delete this.assessments[assessment._cid];
      this.selected.splice(this.selected.indexOf(assessment._cid), 1);
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
    font-size: 18px;
    color: #444;
  }
}
</style>
