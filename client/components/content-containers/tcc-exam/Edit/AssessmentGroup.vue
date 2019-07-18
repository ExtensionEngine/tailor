<template>
  <div class="assessment-group">
    <div :class="{ divider: position }"></div>
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
      :group="group"
      :tes="tes"
      @saveElement="$emit('saveElement', $event)"
      @reorderElement="$emit('reorderElement', $event)"
      @deleteElement="$emit('deleteElement', $event)"/>
    <h4>Questions</h4>
    <div v-if="!hasAssessments" class="well">
      Click the button below to Create first Assessment.
    </div>
    <element-list
      :elements="elements"
      :activity="group"
      :supportedTypes="['ASSESSMENT']"
      @add="addAssessment"
      @reorder="$emit('reorderElement', $event)">
      <assessment-item
        slot="list-item"
        slot-scope="{ element }"
        :assessment="element"
        :objectives="objectives"
        :objectiveLabel="objectiveLabel"
        @save="saveAssessment"
        @delete="deleteElement(element)"/>
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
      unsaved: [],
      timeLimit: get(this.group, 'data.timeLimit', 0)
    };
  },
  computed: {
    assessments() {
      const cond = { activityId: this.group.id, type: 'ASSESSMENT' };
      return sortBy(filter(this.tes, cond), 'position');
    },
    elements() {
      return [...this.assessments, ...this.unsaved];
    },
    hasAssessments() {
      return this.elements && !!this.elements.length;
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
      const cid = cuid();
      this.unsaved.push({ ...assessment, _cid: cid });
    },
    saveAssessment(assessment) {
      if (assessment.id) return this.$emit('updateElement', assessment);
      this.$emit('saveElement', assessment);
    },
    deleteElement(assessment) {
      if (!assessment.id) return this.remove(assessment);
      this.$emit('deleteElement', assessment);
    },
    remove({ _cid: cid }) {
      const index = this.unsaved.findIndex(it => it._cid === cid);
      this.unsaved.splice(index, 1);
    }
  },
  watch: {
    timeLimit: debounce(function (val) {
      let group = cloneDeep(this.group);
      group.data = group.data || {};
      group.data.timeLimit = val;
      this.$emit('update', group);
    }, 1500),
    assessments(val) {
      for (let id in val) {
        if (!this.unsaved.length) return;
        this.remove(val[id]);
      }
    }
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
}

.divider {
  margin: 20px 0 70px;
  border-top: 1px solid #e1e1e1;
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
