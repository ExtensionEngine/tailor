<template>
  <div class="assessment-group">
    <div class="divider"></div>
    <span @click="$emit('delete')" class="remove">
      <span class="mdi mdi-delete"></span>
    </span>
    <div class="form-inline pull-right">
      <div class="form-group time-limit">
        <label for="timeLimit">Time limit (minutes)</label>
        <input
          v-model="timeLimit"
          id="timeLimit"
          class="form-control"
          type="number"
          step="15">
      </div>
    </div>
    <h3>Question group {{ position | toLetter }}</h3>
    <h4>Introduction</h4>
    <group-introduction
      @saveElement="$emit('saveElement', $event)"
      @reorderElement="$emit('reorderElement', $event)"
      @deleteElement="$emit('deleteElement', $event)"
      :group="group"
      :tes="tes" />
    <h4>Questions</h4>
    <div v-if="!hasAssessments" class="well">
      Click the button below to Create first Assessment.
    </div>
    <element-list
      @add="addAssessment"
      @reorder="$emit('reorderElement', $event)"
      :elements="assessments"
      :activity="group"
      :supported-types="['ASSESSMENT']">
      <template v-slot:list-item="{ element }">
        <assessment-item
          @save="saveAssessment"
          @delete="deleteElement(element)"
          :assessment="element"
          :objectives="objectives"
          :objective-label="objectiveLabel" />
      </template>
    </element-list>
  </div>
</template>

<script>
import AssessmentItem from './Assessment';
import cloneDeep from 'lodash/cloneDeep';
import cuid from 'cuid';
import debounce from 'lodash/debounce';
import { ElementList } from 'tce-core';
import filter from 'lodash/filter';
import get from 'lodash/get';
import { getLevel } from 'shared/activities';
import GroupIntroduction from './GroupIntroduction';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';
import numberToLetter from 'utils/numberToLetter';
import pickBy from 'lodash/pickBy';
import sortBy from 'lodash/sortBy';
import uniq from 'lodash/uniq';

export default {
  name: 'assessment-group',
  props: {
    group: { type: Object, required: true },
    tes: { type: Object, required: true },
    objectives: { type: Array, required: true },
    position: { type: Number, required: true }
  },
  data() {
    return {
      unsavedAssessments: {},
      timeLimit: get(this.group, 'data.timeLimit', 0)
    };
  },
  computed: {
    savedAssessments() {
      const cond = { activityId: this.group.id, type: 'ASSESSMENT' };
      return sortBy(filter(this.tes, cond), 'position');
    },
    assessments() {
      const { savedAssessments: saved, unsavedAssessments: unsaved } = this;
      return [...saved, ...Object.values(unsaved)];
    },
    hasAssessments() {
      return this.assessments && !!this.assessments.length;
    },
    objectiveLabel() {
      if (isEmpty(this.objectives)) return '';
      const types = uniq(map(this.objectives, 'type'));
      const label = types.length > 1 ? 'Objective' : getLevel(types[0]).label;
      return `Link ${label}`;
    }
  },
  methods: {
    addAssessment(assessment) {
      Object.assign(assessment, { cid: cuid() });
      this.$set(this.unsavedAssessments, assessment.cid, assessment);
    },
    saveAssessment(assessment) {
      if (assessment.id) return this.$emit('updateElement', assessment);
      this.$emit('saveElement', assessment);
    },
    deleteElement(assessment) {
      if (!assessment.id) return this.remove([assessment]);
      this.$emit('deleteElement', assessment);
    },
    remove(assessments) {
      const ids = assessments.map(it => it.cid);
      const cond = it => !ids.includes(it.cid);
      this.unsavedAssessments = pickBy(this.unsavedAssessments, cond);
    }
  },
  watch: {
    savedAssessments: 'remove',
    timeLimit: debounce(function (val) {
      let group = cloneDeep(this.group);
      group.data = group.data || {};
      group.data.timeLimit = val;
      this.$emit('update', group);
    }, 1500)
  },
  filters: {
    toLetter: numberToLetter
  },
  components: {
    AssessmentItem,
    ElementList,
    GroupIntroduction
  }
};
</script>

<style lang="scss" scoped>
h3 {
  margin: 30px 5px;
  color: #444;
  font-size: 18px;
  text-align: left;
}

h4 {
  margin: 20px 5px;
  color: #444;
  font-size: 16px;
  text-align: left;
}

.assessment-group {
  margin: 30px 0;
  padding: 15px 20px;

  .assessment-item {
    margin-bottom: 12px;
  }

  .well {
    font-size: 16px;
  }

  + .assessment-group {
    .divider {
      margin: 20px 0 70px;
      border-top: 1px solid #e1e1e1;
    }
  }
}

.remove {
  float: right;
  margin: 10px 5px;
  color: #777;
  font-size: 22px;

  &:hover {
    color: #444;
    cursor: pointer;
  }
}

.time-limit {
  margin: 7px 20px;

  label {
    margin-right: 5px;
    vertical-align: bottom;
  }

  input {
    width: 50px;
    text-align: center;
  }
}
</style>
