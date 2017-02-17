<template>
  <div @selected="$emit('selected')" class="assessment-container">
    <div class="assessment" :class="typeInfo.class">
      <div>
        <div class="label assessment-type pull-left">{{ typeInfo.title }}</div>
        <span @click="close" class="btn btn-link pull-right">Collapse</span>
      </div>
      <question
        :assessment="assessment"
        :errors="errors"
        :isEditing="isEditing"
        @update="update">
      </question>
      <component
        :is="getComponentName(assessment)"
        :assessment="assessment"
        :errors="errors"
        :isEditing="isEditing"
        @update="update"
        @alert="setAlert">
      </component>
      <div class="form-group">
        <span class="form-label">Hint</span>
        <input
          v-model="assessment.hint"
          :disabled="!isEditing"
          class="form-control"
          type="text"
          placeholder="Optional hint">
      </div>
      <div class="alert-container">
        <div v-show="alert.text" :class="alert.type" class="alert">
          <strong>{{ alert.text }}</strong>
        </div>
      </div>
      <controls
        :isEditing="isEditing"
        @cancel="cancel"
        @save="save"
        @remove="remove"
        @edit="edit">
      </controls>
    </div>
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep';
import MultipleChoice from './MultipleChoice';
import SingleChoice from './SingleChoice';
import TrueFalse from './TrueFalse';
import NumericalResponse from './NumericalResponse';
import TextResponse from './TextResponse';
import FillBlank from './FillBlank';
import Hotspot from './Hotspot';
import Question from './Question';
import Controls from './Controls';
import { schemas, typeInfo } from '../../../utils/assessment';

const saveAlert = { text: 'Question saved !', type: 'alert-success' };
const validationOptions = { recursive: true, abortEarly: false };

const ASSESSMENT_TYPES = {
  MC: 'multiple-choice',
  SC: 'single-choice',
  TF: 'true-false',
  NR: 'numerical-response',
  TR: 'text-response',
  FB: 'fill-blank',
  HS: 'hotspot'
};

export default {
  name: 'assessment',
  props: { initAssessment: Object },
  data() {
    return {
      assessment: cloneDeep(this.initAssessment),
      isEditing: !this.initAssessment.question,
      alert: {},
      errors: []
    };
  },
  computed: {
    schema() {
      return schemas[this.assessment.type] || {};
    },
    typeInfo() {
      return typeInfo[this.assessment.type] || {};
    }
  },
  methods: {
    getComponentName(assessment) {
      return ASSESSMENT_TYPES[assessment.type];
    },
    setAlert(data = {}) {
      this.alert = data;
    },
    validate(question) {
      return this.schema.validate(question, validationOptions);
    },
    update(data) {
      Object.assign(this.assessment, cloneDeep(data));
    },
    save() {
      this.errors = [];
      this.validate(this.assessment)
        .then(() => {
          this.isEditing = false;
          this.setAlert(saveAlert);
          this.$emit('save', cloneDeep(this.assessment));
        })
        .catch(err => err.inner.forEach(it => this.errors.push(it.path)));
    },
    cancel() {
      Object.assign(this.assessment, cloneDeep(this.initAssessment));
      this.isEditing = false;
      this.setAlert();
      this.errors = [];
    },
    close() {
      this.$emit('selected');
    },
    edit() {
      this.isEditing = true;
    },
    remove() {
      this.$emit('remove');
    }
  },
  components: {
    MultipleChoice,
    SingleChoice,
    TrueFalse,
    NumericalResponse,
    TextResponse,
    FillBlank,
    Hotspot,
    Question,
    Controls
  }
};
</script>

<style lang="scss" scoped>
.assessment {
  min-height: 400px;
  margin: 10px auto;
  padding: 10px 30px 30px 30px;
  background-color: white;
  overflow: hidden;

  .alert {
    display: inline-block;
    margin: 0 auto;
    padding: 3px 7px;
    text-align: center;
  }

  .assessment-type {
    margin: 10px 0 50px 0;
    padding: 4px 15px;
    font-size: 13px;
    background-color: #707070;
    border-radius: 1px;
  }

  .form-group {
    text-align: left;
    margin: 0 auto;
    padding: 25px 20px 15px 20px;
    width: 100%;
    overflow: hidden;
  }

  .form-label {
    font-size: 20px;
  }

  input.form-control {
    padding-left: 10px;
  }
}
</style>
