<template>
  <div @selected="$emit('selected')" class="assessment-container">
    <div class="assessment" :class="typeInfo.class">
      <div class="label label-primary assessment-type">{{ typeInfo.title }}</div>
      <question
        :assessment="assessment"
        :errors="errors"
        :isEditing="isEditing"
        @update="update">
      </question>
      <multiple-choice
        v-if="assessment.type === 'MC'"
        :assessment="assessment"
        :errors="errors"
        :isEditing="isEditing"
        @update="update"
        @alert="setAlert">
      </multiple-choice>
      <single-choice
        v-else-if="assessment.type === 'SC'"
        :assessment="assessment"
        :errors="errors"
        :isEditing="isEditing"
        @update="update"
        @alert="setAlert">
      </single-choice>
      <true-false
        v-else-if="assessment.type === 'TF'"
        :assessment="assessment"
        :errors="errors"
        :isEditing="isEditing"
        @update="update">
      </true-false>
      <numerical-response
        v-else-if="assessment.type === 'NR'"
        :assessment="assessment"
        :errors="errors"
        :isEditing="isEditing"
        @update="update">
      </numerical-response>
      <text-response
        v-else-if="assessment.type === 'TR'"
        :assessment="assessment"
        :errors="errors"
        :isEditing="isEditing"
        @update="update">
      </text-response>
      <fill-blank
        v-else-if="assessment.type === 'FB'"
        :assessment="assessment"
        :errors="errors"
        :isEditing="isEditing"
        @update="update"
        @alert="setAlert">
      </fill-blank>
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
        @close="close"
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
import Question from './Question';
import Controls from './Controls';
import { schemas, typeInfo } from '../../../utils/assessment';

const validationOptions = { recursive: true, abortEarly: false };
const saveAlert = { text: 'Question saved !', type: 'alert-success' };

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
    font-size: 13px;
    float: right;
    background-color: grey;
    margin: 15px 15px 50px 0;
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
