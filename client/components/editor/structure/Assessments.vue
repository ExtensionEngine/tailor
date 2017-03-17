<template>
  <div class="assessments">
    <div class="heading">
      <h2>Assessments</h2>
      <span v-if="hasAssessments" @click="toggleAssessments">
        {{ allSelected ? 'hide all' : 'show all' }}
      </span>
    </div>
    <div class="well" v-if="!hasAssessments">
      Click the button below to Create first Assessment.
    </div>
    <ul class="list-group">
      <assessment-item
        v-for="assessment in assessments"
        :assessment="assessment"
        :expanded="isSelected(assessment)"
        @selected="toggleSelect(assessment)"
        @save="save"
        @remove="remove(assessment)">
      </assessment-item>
    </ul>
    <add-element
      :include="['ASSESSMENT']"
      :activity="activity"
      @add="add">
    </add-element>
  </div>
</template>

<script>
import AddElement from './AddElement';
import AssessmentItem from './AssessmentItem';
import cloneDeep from 'lodash/cloneDeep';
import cuid from 'cuid';
import difference from 'lodash/difference';
import keyBy from 'lodash/keyBy';
import { mapActions, mapGetters } from 'vuex-module';

export default {
  name: 'assessments',
  data() {
    return {
      selected: [],
      assessments: cloneDeep(keyBy(this.getAssessments(), '_cid')),
      allSelected: false
    };
  },
  computed: {
    ...mapGetters(['activity'], 'editor'),
    hasAssessments() {
      return !!Object.keys(this.assessments).length;
    }
  },
  methods: {
    ...mapGetters({ getAssessments: 'assessments' }, 'editor'),
    ...mapActions({
      saveAssessment: 'save',
      updateAssessment: 'update',
      removeAssessment: 'remove'
    }, 'tes'),
    add(assessment) {
      assessment._cid = cuid();
      this.$set(this.assessments, assessment._cid, assessment);
      this.selected.push(assessment._cid);
    },
    toggleSelect(assessment) {
      const question = assessment.data.question;
      const hasQuestion = question && question.lenght > 0;
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
    toggleAssessments() {
      this.allSelected = !this.allSelected;
      const cids = this.allSelected
        ? difference(Object.keys(this.assessments), this.selected)
        : this.selected.slice(0);
      cids.forEach(cid => this.toggleSelect(this.assessments[cid]));
    },
    save(assessment) {
      // TODO: Do this better!
      if (this.assessments[assessment._cid]) {
        assessment.activityId = Number(this.$route.params.activityId);
        assessment.id = this.assessments[assessment._cid].id;
        this.assessments[assessment._cid] = assessment;
        return assessment.id
          ? this.updateAssessment(assessment)
          : this.saveAssessment(assessment);
      }
    },
    remove(assessment) {
      // TODO: Has unsolved scenarios
      if (assessment.id) this.removeAssessment(assessment);
      this.$delete(this.assessments, assessment._cid);
      this.selected.splice(this.selected.indexOf(assessment._cid), 1);
    }
  },
  components: {
    AddElement,
    AssessmentItem
  }
};
</script>

<style lang="scss" scoped>
.assessments {
  margin: 70px 0 250px 0;

  .well {
    font-size: 16px;
  }

  .heading {
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
