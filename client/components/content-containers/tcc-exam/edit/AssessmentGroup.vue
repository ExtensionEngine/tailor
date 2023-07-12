<template>
  <v-container class="assessment-group">
    <div class="divider"></div>
    <v-row justify="end" no-gutters class="pa-0">
      <v-col cols="2">
        <validation-provider
          ref="timeValidator"
          v-slot="{ errors }"
          name="time limit"
          rules="integer|min_value:0">
          <v-text-field
            v-model.number="timeLimit"
            @keydown="e => ['e', '+', '-', '.'].includes(e.key) && e.preventDefault()"
            :error-messages="errors"
            min="0"
            name="timeLimit"
            hint="Time limit (minutes)"
            type="number"
            step="15"
            persistent-hint>
            <template #append-outer>
              <v-icon @click="$emit('delete')">mdi-delete</v-icon>
            </template>
          </v-text-field>
        </validation-provider>
      </v-col>
    </v-row>
    <h3>Question group {{ position | toLetter }}</h3>
    <h4>Introduction</h4>
    <group-introduction
      @save:element="$emit('save:element', $event)"
      @reorder:element="$emit('reorder:element', $event)"
      @delete:element="$emit('delete:element', $event)"
      :group="group"
      :elements="elements" />
    <h4>Questions</h4>
    <v-alert
      :value="!hasAssessments"
      color="blue-grey darken-3"
      icon="mdi-information-variant"
      text>
      Click the button below to Create first Assessment.
    </v-alert>
    <element-list
      @add="addAssessments"
      @update="$emit('reorder:element', $event)"
      :elements="assessments"
      :activity="group"
      :supported-types="['ASSESSMENT']">
      <template #list-item="{ element }">
        <assessment-item
          @save="saveAssessment"
          @delete="deleteAssessment(element)"
          :assessment="element"
          :objectives="objectives"
          :objective-label="objectiveLabel" />
      </template>
    </element-list>
  </v-container>
</template>

<script>
import { numberToLetter, uuid } from '@tailor-cms/utils';
import AssessmentItem from './Assessment.vue';
import cloneDeep from 'lodash/cloneDeep';
import debounce from 'lodash/debounce';
import { ElementList } from '@tailor-cms/core-components';
import filter from 'lodash/filter';
import get from 'lodash/get';
import GroupIntroduction from './GroupIntroduction.vue';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';
import pickBy from 'lodash/pickBy';
import sortBy from 'lodash/sortBy';
import uniq from 'lodash/uniq';

export default {
  name: 'assessment-group',
  inject: ['$schemaService'],
  props: {
    group: { type: Object, required: true },
    elements: { type: Object, required: true },
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
      return sortBy(filter(this.elements, cond), 'position');
    },
    assessments() {
      const { savedAssessments: saved, unsavedAssessments: unsaved } = this;
      return sortBy([...saved, ...Object.values(unsaved)], 'position');
    },
    hasAssessments() {
      return !isEmpty(this.assessments);
    },
    objectiveLabel() {
      if (isEmpty(this.objectives)) return '';
      const types = uniq(map(this.objectives, 'type'));
      const label = types.length > 1
        ? 'Objective'
        : this.$schemaService.getLevel(types[0]).label;
      return `Link ${label}`;
    }
  },
  methods: {
    addAssessments(assessments) {
      assessments.forEach(it => {
        const uid = uuid();
        this.$set(this.unsavedAssessments, uid, { ...it, uid });
      });
    },
    saveAssessment(assessment) {
      this.$emit(assessment.id ? 'update:element' : 'save:element', assessment);
    },
    deleteAssessment(assessment) {
      if (!assessment.id) return this.clearUnsavedAssessments([assessment]);
      this.$emit('delete:element', assessment);
    },
    clearUnsavedAssessments(assessments) {
      const ids = assessments.map(it => it.uid);
      const cond = it => !ids.includes(it.uid);
      this.unsavedAssessments = pickBy(this.unsavedAssessments, cond);
    }
  },
  watch: {
    savedAssessments: 'clearUnsavedAssessments',
    timeLimit: debounce(function (val) {
      this.$refs.timeValidator.validate().then(({ valid }) => {
        if (!valid) return;
        const group = cloneDeep(this.group);
        group.data = group.data || {};
        group.data.timeLimit = val;
        this.$emit('update', group);
      });
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
  font-size: 18px;
  text-align: left;
  color: #444;
}

h4 {
  margin: 20px 5px;
  font-size: 16px;
  text-align: left;
  color: #444;
}

.assessment-group {
  margin: 30px 0;
  padding: 15px 20px;

  .assessment-item {
    margin-bottom: 12px;
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
  font-size: 22px;
  color: #777;

  &:hover {
    cursor: pointer;
    color: #444;
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
