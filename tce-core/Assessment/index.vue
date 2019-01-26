<template>
  <div @selected="$emit('selected')" class="assessment-container">
    <div class="assessment">
      <question
        :assessment="element"
        :errors="errors"
        :isEditing="isEditing"
        @update="update"/>
      <component
        :is="resolveComponentName(element)"
        :assessment="element.data"
        :errors="errors"
        :isEditing="isEditing"
        @update="update"
        @alert="setAlert"/>
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
        @update="updateFeedback"/>
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
        @edit="edit"
        class="controls"/>
    </div>
  </div>
</template>

<script>
import { getComponentName, processAssessmentType } from '../utils';
import cloneDeep from 'lodash/cloneDeep';
import Controls from './Controls';
import dropRight from 'lodash/dropRight';
import Feedback from './Feedback';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import last from 'lodash/last';
import map from 'lodash/map';
import Question from './Question';
import toPath from 'lodash/toPath';

const saveAlert = { text: 'Question saved !', type: 'alert-success' };
const validationOptions = { recursive: true, abortEarly: false };

export default {
  name: 'te-assessment',
  inject: ['$teRegistry'],
  props: {
    element: { type: Object, required: true }
  },
  data() {
    const isEditing = !this.element.id;
    return {
      isEditing,
      alert: {},
      errors: [],
      previousVersion: null
    };
  },
  computed: {
    assessmentType() {
      return this.element.data.type;
    },
    schema() {
      return this.$teRegistry.get(this.assessmentType).schema;
    },
    hintError() {
      return this.errors.includes('hint');
    },
    showFeedback() {
      const { assessmentType } = this;
      const feedbackSupported = ['MC', 'SC', 'TF'].indexOf(assessmentType) > -1;
      return !this.summative && feedbackSupported;
    }
  },
  methods: {
    resolveComponentName(element) {
      return getComponentName(processAssessmentType(element.data.type));
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
      const element = cloneDeep(this.element);
      Object.assign(element.data, data);
      this.$emit('add', element);
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
      this.validate(this.element.data).then(() => {
        this.$emit('save', cloneDeep(this.element.data));
        this.isEditing = false;
        this.setAlert(saveAlert);
      }).catch(err => (this.errors = errorProcessor(err)));
    },
    cancel() {
      if (!this.previousVersion) {
        this.$emit('remove');
      } else {
        this.$emit('add', cloneDeep(this.previousVersion));
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
    updateFeedback(feedback) {
      const element = cloneDeep(this.element);
      element.data.feedback = element.data.feedback || {};
      Object.assign(element.data.feedback, feedback);
      this.$emit('add', element);
    }
  },
  components: { Controls, Feedback, Question }
};

function errorProcessor(error) {
  let item = error.value;
  if (item.type !== 'DD') return map(error.inner, it => it.path);
  // TODO: Nasty !!
  return map(error.inner, it => {
    let path = toPath(it.path);
    if (path.length === 1) return it.path;
    if (last(path) !== 'value') return;
    let key = get(error.value, dropRight(path).concat('key'));
    return `${path[0]}${key}`;
  });
}
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
}

.disabled .controls {
  display: none;
}
</style>
