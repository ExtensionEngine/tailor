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
    <ul class="list-group pl-0">
      <assessment-item
        v-for="it in assessments"
        :key="it.uid"
        @selected="toggleSelect(it)"
        @save="saveAssessment"
        @delete="$emit('deleteElement', it)"
        :assessment="it"
        :expanded="isSelected(it)" />
    </ul>
    <add-element
      @add="addAssessments"
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
import AssessmentItem from 'tce-core/AssessmentItem';
import filter from 'lodash/filter';
import last from 'lodash/last';
import sortBy from 'lodash/sortBy';
import uuid from '@/utils/uuid';

export default {
  name: 'assessment-pool',
  props: {
    container: { type: Object, required: true },
    elements: { type: Object, required: true }
  },
  data: () => ({
    selected: [],
    allSelected: false
  }),
  computed: {
    assessments() {
      const activityId = this.container.id;
      const assessments = filter(this.elements, { activityId });
      return sortBy(assessments, 'position');
    },
    nextPosition() {
      const lastItem = last(this.assessments);
      return lastItem ? lastItem.position + 1 : 1;
    },
    hasAssessments: vm => vm.assessments.length
  },
  methods: {
    addAssessments(assessments) {
      assessments.forEach(it => {
        const uid = uuid();
        this.$emit('addElement', { ...it, uid });
        this.selected.push(uid);
      });
    },
    saveAssessment(assessment) {
      const event = assessment.id ? 'updateElement' : 'saveElement';
      return this.$emit(event, assessment);
    },
    toggleSelect(assessment) {
      const { question } = assessment.data;
      const hasQuestion = question && question.length;
      if (this.isSelected(assessment) && !hasQuestion) {
        this.$emit('deleteElement', assessment);
      } else if (this.isSelected(assessment)) {
        this.selected.splice(this.selected.indexOf(assessment._cid), 1);
      } else {
        this.selected.push(assessment._cid);
      }
    },
    isSelected(assessment) {
      return this.selected.includes(assessment._cid);
    },
    clearSelected() {
      const ids = this.assessments.map(it => it._cid);
      this.selected = this.selected.filter(it => ids.includes(it));
    },
    toggleAssessments() {
      this.allSelected = !this.allSelected;
      this.selected = this.allSelected ? this.assessments.map(it => it._cid) : [];
    }
  },
  watch: {
    assessments: 'clearSelected'
  },
  components: { AddElement, AssessmentItem }
};
</script>

<style lang="scss" scoped>
.assessments {
  margin: 4rem 0 15rem;

  .v-alert {
    color: #555;
  }

  .heading {
    display: flex;
    justify-content: space-between;
    align-content: center;
    padding: 0 0 0.5rem 0.125rem;

    .v-btn {
      margin: 0.25rem 0 0;
      padding: 0;
    }
  }

  h2 {
    display: inline-block;
    margin: 0;
    font-size: 1.125rem;
    line-height: 1.875rem;
    vertical-align: middle;
  }
}
</style>
