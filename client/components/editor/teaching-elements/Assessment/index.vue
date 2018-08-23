<template>
  <div @selected="$emit('selected')" class="assessment-container">
    <div :class="typeInfo.class" class="assessment">
      <div v-if="summative">
        <div class="label assessment-type pull-left">{{ typeInfo.title }}</div>
        <span @click="close" class="btn btn-link pull-right">Collapse</span>
        <div v-if="exam && examObjectives.length" class="select-leaf">
          <multiselect
            :value="objective"
            :options="examObjectives"
            :searchable="true"
            :disabled="!isEditing || !examObjectives.length"
            :trackBy="'id'"
            :customLabel="it => it.data ? it.data.name : ''"
            :placeholder="examObjectiveLabel"
            :showReset="isEditing"
            @input="onObjectiveSelected">
          </multiselect>
        </div>
      </div>
      <question
        :assessment="element"
        :errors="errors"
        :isEditing="isEditing"
        @update="update">
      </question>
      <component
        :is="getComponentName(element)"
        :assessment="element.data"
        :errors="errors"
        :isEditing="isEditing"
        @update="update"
        @alert="setAlert">
      </component>
      <div :class="{ 'has-error': hintError }" class="form-group">
        <span class="form-label">Hint</span>
        <input
          v-model="element.data.hint"
          :disabled="!isEditing"
          class="form-control"
          type="text"
          placeholder="Optional hint">
      </div>
      <feedback
        v-if="showFeedback"
        :answers="element.data.answers"
        :feedback="element.data.feedback"
        :isEditing="isEditing"
        @update="updateFeedback">
      </feedback>
      <div class="alert-container">
        <div v-show="alert.text" :class="alert.type" class="alert">
          <strong>{{ alert.text }}</strong>
        </div>
      </div>
      <controls
        :isEditing="isEditing"
        :summative="summative"
        @cancel="cancel"
        @save="save"
        @remove="remove"
        @edit="edit"
        class="controls">
      </controls>
    </div>
  </div>
</template>

<script>
import { errorProcessor, schemas, typeInfo } from 'utils/assessment';
import { getLevel } from 'shared/activities';
import { mapGetters, mapMutations } from 'vuex-module';
import cloneDeep from 'lodash/cloneDeep';
import Controls from './Controls';
import DragDrop from './DragDrop';
import Feedback from './Feedback';
import FillBlank from './FillBlank';
import find from 'lodash/find';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';
import MatchingQuestion from './MatchingQuestion';
import MultipleChoice from './MultipleChoice';
import multiselect from '../../../common/Select';
import NumericalResponse from './NumericalResponse';
import Question from './Question';
import set from 'lodash/set';
import SingleChoice from './SingleChoice';
import TextResponse from './TextResponse';
import TrueFalse from './TrueFalse';
import uniq from 'lodash/uniq';
import unset from 'lodash/unset';
import RangeSlider from './RangeSlider';

const saveAlert = { text: 'Question saved !', type: 'alert-success' };
const validationOptions = { recursive: true, abortEarly: false };

const ASSESSMENT_TYPES = {
  MC: 'multiple-choice',
  SC: 'single-choice',
  TF: 'true-false',
  NR: 'numerical-response',
  TR: 'text-response',
  FB: 'fill-blank',
  MQ: 'matching-question',
  DD: 'drag-drop',
  RS: 'range-slider'
};

export default {
  name: 'te-assessment',
  props: {
    element: { type: Object, required: true },
    exam: { type: Object, default: null },
    summative: { type: Boolean, default: false }
  },
  data() {
    const isEditing = !this.element.id;
    return {
      isEditing,
      alert: {},
      errors: [],
      previousVersion: null,
      objective: null
    };
  },
  computed: {
    ...mapGetters(['getExamObjectives'], 'activities'),
    schema() {
      return schemas[this.element.data.type] || {};
    },
    typeInfo() {
      return typeInfo[this.element.data.type] || {};
    },
    hintError() {
      return this.errors.includes('hint');
    },
    showFeedback() {
      const assessmentType = this.element.data.type;
      const feedbackSupported = ['MC', 'SC', 'TF'].indexOf(assessmentType) > -1;
      return !this.summative && feedbackSupported;
    },
    examObjectives() {
      if (!this.exam) return [];
      return this.getExamObjectives(this.exam);
    },
    examObjectiveLabel() {
      if (isEmpty(this.examObjectives)) return '';
      const types = uniq(map(this.examObjectives, 'type'));
      const label = types.length > 1 ? 'Objective' : getLevel(types[0]).label;
      return `Link ${label}`;
    }
  },
  methods: {
    ...mapMutations({ addElement: 'add' }, 'tes'),
    getComponentName(element) {
      return ASSESSMENT_TYPES[element.data.type];
    },
    setAlert(data = {}) {
      this.alert = data;
      const { type, message } = data;
      if (type && type !== 'alert-danger') {
        setTimeout(() => {
          if (message === this.alert.message) this.setAlert();
        }, 3000);
      }
    },
    validate(data) {
      return this.schema.validate(data, validationOptions);
    },
    update(data, validate) {
      let element = cloneDeep(this.element);
      Object.assign(element.data, data);
      this.addElement(element);

      if (validate && !isEmpty(this.errors)) {
        this.errors = [];
        this.validate(element.data).catch(err => {
          this.errors = errorProcessor(err);
        });
      }
    },
    save() {
      if (!this.isEditing) return;
      this.errors = [];
      this.validate(this.element.data)
        .then(() => {
          let data = this.summative ? this.element : this.element.data;
          data = cloneDeep(data);
          if (this.objective) {
            set(data, 'refs.objectiveId', this.objective.id);
          } else {
            unset(data, 'refs.objectiveId');
          }
          this.$emit('save', data);
          this.isEditing = false;
          this.setAlert(saveAlert);
        })
        .catch(err => (this.errors = errorProcessor(err)));
    },
    cancel() {
      if (!this.previousVersion) {
        this.$emit('remove');
      } else {
        this.addElement(cloneDeep(this.previousVersion));
        this.setObjective();
        this.isEditing = false;
        this.setAlert();
        this.errors = [];
      }
    },
    close() {
      this.$emit('selected');
    },
    edit() {
      this.previousVersion = cloneDeep(this.element);
      this.isEditing = true;
    },
    remove() {
      this.$emit('remove');
    },
    setObjective() {
      const objectiveId = get(this.element, 'refs.objectiveId');
      if (!objectiveId) return;
      this.objective = find(this.examObjectives, { id: objectiveId });
    },
    updateFeedback(feedback) {
      let element = cloneDeep(this.element);
      element.data.feedback = element.data.feedback || {};
      Object.assign(element.data.feedback, feedback);
      this.addElement(element);
    },
    onObjectiveSelected(objective) {
      this.objective = objective;
    }
  },
  mounted() {
    this.setObjective();
  },
  components: {
    MultipleChoice,
    SingleChoice,
    TrueFalse,
    NumericalResponse,
    TextResponse,
    Feedback,
    FillBlank,
    Question,
    Controls,
    MatchingQuestion,
    DragDrop,
    multiselect,
    RangeSlider
  }
};
</script>

<style lang="scss" scoped>
.assessment {
  min-height: 400px;
  margin: 10px auto;
  padding: 10px 30px 30px;
  background-color: white;
  overflow: visible;

  .alert {
    display: inline-block;
    margin: 0 auto;
    padding: 3px 7px;
    text-align: center;
  }

  .assessment-type {
    margin: 10px 0 20px;
    padding: 4px 15px;
    font-size: 13px;
    background-color: #707070;
    border-radius: 1px;
  }

  .form-group {
    text-align: left;
    width: 100%;
    margin: 0 auto;
    padding: 25px 20px 15px;
    overflow: hidden;
  }

  .form-label {
    font-size: 20px;
  }

  input.form-control {
    padding-left: 10px;
  }

  .select-leaf {
    clear: both;

    > div {
      width: 400px;
      float: right;
    }
  }
}

.disabled .controls {
  display: none;
}
</style>

<style lang="scss">
.select-leaf {
  input {
    height: 32px;
  }
}
</style>
