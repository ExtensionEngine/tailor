<template>
  <div class="tce-question-container">
    <slot :isEditing="isEditing"></slot>
    <question
      @update="update"
      :assessment="editedElement"
      :is-editing="isEditing"
      :errors="errors" />
    <component
      :is="resolveComponentName(element)"
      @update="update"
      @alert="setAlert"
      :assessment="editedElement.data"
      :is-graded="isGraded"
      :is-editing="isEditing"
      :errors="errors" />
    <div :class="{ 'has-error': hintError }" class="form-group hint">
      <span class="form-label">Hint</span>
      <input
        v-model="editedElement.data.hint"
        :disabled="!isEditing"
        class="form-control"
        type="text"
        placeholder="Optional hint">
    </div>
    <feedback
      v-if="showFeedback"
      @update="updateFeedback"
      :answers="editedElement.data.answers"
      :feedback="editedElement.data.feedback"
      :is-graded="isGraded"
      :is-editing="isEditing" />
    <div class="alert-container">
      <div v-show="alert.text" :class="alert.type" class="alert">
        <strong>{{ alert.text }}</strong>
      </div>
    </div>
    <controls
      @edit="edit"
      @save="save"
      @remove="remove"
      @cancel="cancel"
      class="controls"
      :is-editing="isEditing" />
  </div>
</template>

<script>
import * as yup from 'yup';
import { getComponentName, processAnswerType } from '../utils';
import cloneDeep from 'lodash/cloneDeep';
import Controls from './Controls';
import dropRight from 'lodash/dropRight';
import Feedback from './Feedback';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import last from 'lodash/last';
import map from 'lodash/map';
import omit from 'lodash/omit';
import Question from './Question';
import toPath from 'lodash/toPath';

const TEXT_CONTAINERS = ['JODIT_HTML', 'HTML'];
const validationOptions = { recursive: true, abortEarly: false };

export default {
  name: 'tce-question-container',
  inject: ['$teRegistry'],
  props: {
    element: { type: Object, required: true }
  },
  data() {
    const isEditing = !this.element.id;
    return {
      isEditing,
      editedElement: cloneDeep(this.element),
      undoState: cloneDeep(this.element),
      alert: {},
      errors: []
    };
  },
  computed: {
    schema() {
      const elementSchema = this.$teRegistry.get(this.answerType).schema;
      return yup.object().shape({
        ...baseSchema,
        ...this.isGraded ? elementSchema : omit(elementSchema, ['correct'])
      });
    },
    answerType() {
      return this.element.data.type;
    },
    isGraded() {
      return this.element.type === 'ASSESSMENT';
    },
    hintError() {
      return this.errors.includes('hint');
    },
    showFeedback() {
      const { answerType } = this;
      const feedbackSupported = ['MC', 'SC', 'TF'].indexOf(answerType) > -1;
      return feedbackSupported;
    }
  },
  methods: {
    resolveComponentName(element) {
      return getComponentName(processAnswerType(this.answerType));
    },
    edit() {
      this.editedElement = cloneDeep(this.element);
      this.undoState = cloneDeep(this.element);
      this.isEditing = true;
    },
    update(data, validate) {
      Object.assign(this.editedElement.data, data);
      if (validate && !isEmpty(this.errors)) {
        this.errors = [];
        this.validate().catch(err => (this.errors = errorProcessor(err)));
      }
      this.$emit('add', this.editedElement);
    },
    save() {
      if (!this.isEditing) return;
      this.errors = [];
      this.validate().then(() => {
        this.$emit('save', cloneDeep(this.editedElement.data));
        this.isEditing = false;
      }).catch(err => (this.errors = errorProcessor(err)));
    },
    cancel() {
      if (!this.editedElement.id) return this.$emit('delete');
      this.$emit('add', cloneDeep(this.undoState));
      this.editedElement = cloneDeep(this.undoState);
      this.isEditing = false;
      this.setAlert();
      this.errors = [];
    },
    close() {
      this.$emit('selected');
    },
    remove() {
      this.$emit('remove');
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
    validate() {
      return this.schema.validate(this.editedElement.data, validationOptions);
    },
    updateFeedback(data) {
      const { editedElement: element } = this;
      this.$set(element.data, 'feedback', { ...element.data.feedback, ...data });
    }
  },
  components: { Controls, Feedback, Question }
};

function errorProcessor(error) {
  const item = error.value;
  if (item.type !== 'DD') return map(error.inner, it => it.path);
  // TODO: Nasty !!
  return map(error.inner, it => {
    const path = toPath(it.path);
    if (path.length === 1) return it.path;
    if (last(path) !== 'value') return;
    const key = get(error.value, dropRight(path).concat('key'));
    return `${path[0]}${key}`;
  });
}

const question = yup.array().test(
  'has-text', 'Please define question', question => !!question.find(containsText)
);

function containsText(asset) {
  return TEXT_CONTAINERS.includes(asset.type) &&
    asset.data.content &&
    asset.data.content.trim().length > 0;
}

const baseSchema = {
  question,
  hint: yup.string().trim().max(500),
  _refs: yup.object().shape({
    objectiveId: yup.number().integer().positive()
  })
};
</script>

<style lang="scss" scoped>
.tce-question-container {
  min-height: 400px;
  margin: 10px auto;
  padding: 10px 30px 30px;
  background-color: white;
  overflow: visible;

  ::v-deep .title {
    font-weight: 400;
  }

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
