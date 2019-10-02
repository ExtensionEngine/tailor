<template>
  <div class="assessment-container">
    <div class="assessment">
      <slot></slot>
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
      <div class="hint">
        <span class="title">Hint</span>
        <v-text-field
          v-model="editedElement.data.hint"
          :disabled="!isEditing"
          :error="hintError"
          hide-details
          single-line
          placeholder="Optional hint" />
      </div>
      <feedback
        v-if="showFeedback"
        @update="updateFeedback"
        :answers="editedElement.data.answers"
        :feedback="editedElement.data.feedback"
        :is-graded="isGraded"
        :is-editing="isEditing" />
      <v-alert v-show="alert.text" outlined :type="alert.type">
        {{ alert.text }}
      </v-alert>
      <controls
        @edit="edit"
        @save="save"
        @remove="remove"
        @cancel="cancel"
        class="controls"
        :is-editing="isEditing" />
    </div>
  </div>
</template>

<script>
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
import yup from 'yup';

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
      if (type && type !== 'error') {
        setTimeout(() => {
          if (message === this.alert.message) this.setAlert();
        }, 3000);
      }
    },
    validate() {
      return this.schema.validate(this.editedElement.data, validationOptions);
    },
    updateFeedback(feedback) {
      const data = this.editedElement.data;
      data.feedback = data.feedback || {};
      Object.assign(data.feedback, feedback);
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

const question = yup.array().test(
  'has-text', 'Please define question', question => !!question.find(containsText)
);

function containsText(asset) {
  return asset.type === 'HTML' &&
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
.assessment {
  min-height: 400px;
  margin: 10px auto;
  padding: 10px 30px 30px;
  background-color: white;
  overflow: visible;

  .v-alert {
    margin-top: 16px;
  }

  .assessment-type {
    margin: 10px 0 20px;
    padding: 4px 15px;
    font-size: 13px;
    background-color: #707070;
    border-radius: 1px;
  }

  .hint {
    text-align: left;
    padding: 25px 20px 15px;
    overflow: hidden;
  }
}

.disabled .controls {
  display: none;
}
</style>
