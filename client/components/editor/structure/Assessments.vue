<template>
  <div class="assessments">
    <h2>Assessments</h2>
    <ul class="list-group">
      <assessment-item
        v-for="assessment in assessments"
        :assessment="assessment"
        :edit="isSelected(assessment)"
        @selected="toggleSelect(assessment)"
        @save="save"
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
          type: 'SC',
          question: 'What is the biggest city in USA ?',
          answers: ['NY', 'Los Angeles'],
          correct: '0',
          hint: ''
        },
        '424': {
          _cid: '424',
          type: 'TF',
          question: 'The biggest city in the UK is London ?',
          correct: 'True',
          hint: ''
        },
        '425': {
          _cid: '425',
          type: 'NR',
          question: 'What is the value of pi (two decimals) ?',
          correct: '3.14',
          hint: ''
        },
        '426': {
          _cid: '426',
          type: 'TR',
          question: 'Name three countries',
          correct: 'USA, Canada, Croatia',
          hint: ''
        }
      }
    };
  },
  methods: {
    add(type) {
      const _cid = cuid();
      this.assessments[_cid] = { _cid, type };
      this.selected.push(_cid);
    },
    toggleSelect(assessment) {
      const hasQuestion = this.assessments[assessment._cid].question;

      if (this.isSelected(assessment) && !hasQuestion) {
        this.remove(assessment);
      } else if (this.isSelected(assessment)) {
        this.selected.splice(this.selected.indexOf(assessment._cid), 1);
      } else {
        this.selected.push(assessment._cid);
      }
    },
    isSelected(assessment) {
      return this.selected.includes(assessment._cid);
    },
    save(assessment) {
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
