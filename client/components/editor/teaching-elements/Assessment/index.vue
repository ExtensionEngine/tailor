<template>
  <div @selected="$emit('selected')" class="assessment-container">
    <div :class="typeInfo.class" class="assessment">
      <div v-if="summative">
        <div class="label assessment-type pull-left">{{ typeInfo.title }}</div>
        <span @click="close" class="btn btn-link pull-right">Collapse</span>
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
        @edit="edit">
      </controls>
    </div>
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep';
import Controls from './Controls';
import FillBlank from './FillBlank';
import isEmpty from 'lodash/isEmpty';
import { mapMutations } from 'vuex-module';
import MatchingQuestion from './MatchingQuestion';
import MultipleChoice from './MultipleChoice';
import NumericalResponse from './NumericalResponse';
import SingleChoice from './SingleChoice';
import TextResponse from './TextResponse';
import TrueFalse from './TrueFalse';
import { typeInfo, schemas } from 'utils/assessment';
import Question from './Question';

const saveAlert = { text: 'Question saved !', type: 'alert-success' };
const validationOptions = { recursive: true, abortEarly: false };

const ASSESSMENT_TYPES = {
  MC: 'multiple-choice',
  SC: 'single-choice',
  TF: 'true-false',
  NR: 'numerical-response',
  TR: 'text-response',
  FB: 'fill-blank',
  MQ: 'matching-question'
};

export default {
  name: 'te-assessment',
  props: { element: Object, summative: Boolean },
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
    schema() {
      return schemas[this.element.data.type] || {};
    },
    typeInfo() {
      return typeInfo[this.element.data.type] || {};
    },
    hintError() {
      return this.errors.includes('hint');
    }
  },
  methods: {
    ...mapMutations({ addElement: 'add' }, 'tes'),
    getComponentName(element) {
      return ASSESSMENT_TYPES[element.data.type];
    },
    setAlert(data = {}) {
      this.alert = data;
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
        this.validate(this.element.data)
          .catch(err => err.inner.forEach(it => this.errors.push(it.path)));
      }
    },
    save() {
      this.errors = [];
      this.validate(this.element.data)
        .then(() => {
          const data = this.summative ? this.element : this.element.data;
          this.$emit('save', cloneDeep(data));
          this.isEditing = false;
          this.setAlert(saveAlert);
        })
        .catch(err => err.inner.forEach(it => this.errors.push(it.path)));
    },
    cancel() {
      if (!this.element.id) {
        this.$emit('remove');
      } else {
        this.addElement(cloneDeep(this.previousVersion));
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
    Controls,
    MatchingQuestion
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
