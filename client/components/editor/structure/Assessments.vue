<template>
  <div class="assessments">
    <div class="overview">
      <h2>Assessments</h2>
      <span @click.stop="toggleAllSelected">
        {{ allSelected ? 'hide all' : 'show all' }}
      </span>
    </div>
    <div class="well" v-if="isEmpty">
      Click the button bellow to Create first Assessment.
    </div>
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
import Vue from 'vue';
import AssessmentItem from './AssessmentItem';
import SelectAssessment from './SelectAssessment';
import { mapActions, mapMutations, mapGetters } from 'vuex-module';

export default {
  name: 'assessments',
  data() {
    return {
      selected: [],
      assessments: {},
      allSelected: false
    };
  },
  created() {
    const courseId = this.$route.params.courseKey;
    const activityId = this.$route.params.activityKey;
    this.setupAssessmentApi(`/courses/${courseId}/assessments`);
    this.fetchAssessments({ activityId }).then(() => this.refresh());
  },
  computed: {
    isEmpty() {
      return !Object.keys(this.assessments).length;
    }
  },
  methods: {
    ...mapGetters({ getAssessments: 'assessments' }, 'atom'),
    ...mapActions({
      removeAssessment: 'remove',
      saveAssessment: 'save',
      updateAssessment: 'update',
      fetchAssessments: 'fetch'
    }, 'assessments'),
    ...mapMutations({ setupAssessmentApi: 'setBaseUrl' }, 'assessments'),
    refresh() {
      const assessments = {};
      this.getAssessments().forEach(a => { assessments[a._cid] = a; });
      this.assessments = assessments;
    },
    add(type) {
      const _cid = cuid();
      Vue.set(this.assessments, _cid, { _cid, type });
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
    toggleAllSelected() {
      this.allSelected = !this.allSelected;
      const cids = this.allSelected
        ? Object.keys(this.assessments).filter(cid => !this.selected.includes(cid))
        : this.selected.slice(0);
      cids.forEach(cid => this.toggleSelect(this.assessments[cid]));
    },
    save(assessment) {
      if (this.assessments[assessment._cid]) {
        assessment.activityId = Number(this.$route.params.activityKey);
        assessment.id = this.assessments[assessment._cid].id;
        this.assessments[assessment._cid] = assessment;
        return assessment.id
          ? this.updateAssessment(assessment)
          : this.saveAssessment(assessment);
      }
    },
    remove(assessment) {
      if (assessment.id) this.removeAssessment(assessment);
      Vue.delete(this.assessments, assessment._cid);
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

  .well {
    font-size: 16px;
  }

  .overview {
    text-align: left;

    span {
      float: right;
      margin-top: 12px;
      cursor: pointer;
    }
  }

  h2 {
    display: inline-block;
    margin: 10px 0 15px 0;
    padding: 0;
    font-size: 18px;
    color: #444;
  }
}
</style>
