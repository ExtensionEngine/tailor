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
import { mapActions, mapMutations, mapGetters } from 'vuex-module';

export default {
  name: 'assessments',
  data() {
    return {
      selected: [],
      assessments: {}
    };
  },
  created() {
    const courseId = this.$route.params.courseKey;
    const activityId = this.$route.params.activityKey;
    this.setupAssessmentApi(`/courses/${courseId}/assessments`);
    this.fetchAssessments({ activityId })
      .then(() => { this.assessments = this.getAssessments(); });
  },
  methods: {
    ...mapGetters({ getAssessments: 'assessments' }),
    ...mapActions({
      removeAssessment: 'remove',
      saveAssessment: 'save',
      fetchAssessments: 'fetch'
    }, 'assessments'),
    ...mapMutations({ setupAssessmentApi: 'setBaseUrl' }, 'assessments'),
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
        assessment.activityId = this.$route.params.activityKey;
        this.saveAssessment(assessment);
      }
    },
    remove(assessment) {
      if (assessment.id) {
        this.removeAssessment(assessment);
      } else {
        delete this.assessments[assessment._cid];
        this.selected.splice(this.selected.indexOf(assessment._cid), 1);
      }
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
