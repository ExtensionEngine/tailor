<template>
  <div class="assessments">
    <div class="heading">
      <h2 class="blue-grey--text text--darken-3">Assessments</h2>
      <v-btn v-if="hasAssessments" @click="toggleAssessments" text small>
        {{ allSelected ? 'hide all' : 'show all' }}
      </v-btn>
    </div>
    <v-alert :value="!hasAssessments" color="white" icon="mdi-information-variant">
      Click the button below to create first assessment.
    </v-alert>
    <ul class="list-group">
      <assessment-item
        v-for="it in assessments"
        :key="it._cid"
        @selected="toggleSelect(it)"
        @save="saveAssessment"
        @delete="$emit('deleteElement', it)"
        :assessment="it"
        :expanded="isSelected(it)" />
    </ul>
    <add-element
      @add="addAssessment"
      :include="['ASSESSMENT']"
      :activity="container"
      :position="nextPosition"
      :layout="false"
      large
      label="Add assessment" />
  </div>
</template>

<script>
import AddElement from 'tce-core/AddElement';
import AssessmentItem from '@/components/editor/structure/AssessmentItem';
import cuid from 'cuid';
import filter from 'lodash/filter';
import last from 'lodash/last';
import map from 'lodash/map';
import pickBy from 'lodash/pickBy';
import sortBy from 'lodash/sortBy';

export default {
  name: 'assessment-block',
  props: {
    container: { type: Object, required: true },
    tes: { type: Object, required: true }
  },
  data() {
    return {
      unsavedAssessments: {},
      selected: [],
      allSelected: false
    };
  },
  computed: {
    savedAssessments() {
      return filter(this.tes, { activityId: this.container.id });
    },
    assessments() {
      const { savedAssessments: saved, unsavedAssessments: unsaved } = this;
      return sortBy([...saved, ...Object.values(unsaved)], 'position');
    },
    nextPosition() {
      const lastItem = last(this.assessments);
      return lastItem ? lastItem.position + 1 : 1;
    },
    hasAssessments: vm => vm.assessments.length
  },
  methods: {
    addAssessment(assessment) {
      const data = { ...assessment, _cid: cuid() };
      this.$set(this.unsavedAssessments, data._cid, data);
      this.selected.push(data._cid);
    },
    saveAssessment(assessment) {
      // TODO: Figure out why save is broken (for update)
      const event = assessment.id ? 'updateElement' : 'saveElement';
      return this.$emit(event, assessment);
    },
    clearUnsavedAssessments(assessments) {
      const ids = assessments.map(it => it._cid);
      const cond = it => !ids.includes(it._cid);
      this.unsavedAssessments = pickBy(this.unsavedAssessments, cond);
    },
    toggleSelect(assessment) {
      const { question } = assessment.data;
      const hasQuestion = question && question.length;
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
      this.selected = this.allSelected ? map(this.assessments, it => it._cid) : [];
    }
  },
  watch: {
    savedAssessments: 'clearUnsavedAssessments'
  },
  components: { AddElement, AssessmentItem }
};
</script>

<style lang="scss" scoped>
.assessments {
  margin: 70px 0 250px;

  .v-alert {
    color: #555;
  }

  .heading {
    text-align: left;
    padding: 0 0 8px 2px;

    .v-btn {
      float: right;
      margin: 4px 0 0;
      padding: 0;
    }
  }

  h2 {
    display: inline-block;
    margin: 0;
    font-size: 18px;
    line-height: 30px;
    vertical-align: middle;
  }
}
</style>
