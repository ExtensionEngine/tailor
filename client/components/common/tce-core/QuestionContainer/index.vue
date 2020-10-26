<template>
  <v-card class="tce-question-container my-2 grey lighten-5">
    <v-toolbar
      color="blue-grey darken-3"
      height="36"
      dark
      class="mb-5 px-0 elevation-2 text-left">
      <v-icon color="secondary lighten-2" size="18" class="mr-2">mdi-help</v-icon>
      <span class="subtitle-2">{{ config.name }}</span>
    </v-toolbar>
    <slot :isEditing="isEditing"></slot>
    <div class="content">
      <question
        @update="update"
        :assessment="editedElement"
        :is-editing="isEditing"
        :errors="errors" />
      <component
        :is="componentName"
        @update="update"
        @alert="alert = $event"
        :assessment="editedElement.data"
        :is-editing="isEditing"
        :is-graded="isGraded"
        :errors="errors"
        class="tce-answer" />
      <div class="subtitle-2 mb-2">Hint</div>
      <v-text-field
        v-model="editedElement.data.hint"
        :error-messages="hintErrors"
        :disabled="!isEditing"
        placeholder="Optional hint..."
        color="blue-darken darken-3"
        filled clearable />
      <feedback
        v-if="showFeedback"
        @update="updateFeedback"
        :answers="editedElement.data.answers"
        :feedback="editedElement.data.feedback"
        :is-graded="isGraded"
        :is-editing="isEditing" />
      <v-alert
        v-show="alert.text"
        :type="alert.type"
        prominent
        class="mt-4">
        {{ alert.text }}
      </v-alert>
      <controls
        v-if="!isDisabled"
        @edit="edit"
        @save="save"
        @cancel="cancel"
        :is-editing="isEditing"
        class="controls" />
    </div>
  </v-card>
</template>

<script>
import * as yup from 'yup';
import { getComponentName, processAnswerType } from '../utils';
import cloneDeep from 'lodash/cloneDeep';
import Controls from './Controls';
import Feedback from './Feedback';
import { getErrorMessages } from 'utils/assessment';
import isEmpty from 'lodash/isEmpty';
import omit from 'lodash/omit';
import Question from './Question';

const resolveComponentName = type => getComponentName(processAnswerType(type));

const WITH_FEEDBACK = ['MC', 'SC', 'TF'];
const TEXT_CONTAINERS = ['JODIT_HTML', 'HTML'];
const validationOptions = { recursive: true, abortEarly: false };

export default {
  name: 'tce-question-container',
  inject: ['$teRegistry'],
  props: {
    element: { type: Object, required: true },
    isDisabled: { type: Boolean, default: false }
  },
  data: vm => ({
    isEditing: !vm.element.id,
    editedElement: cloneDeep(vm.element),
    undoState: cloneDeep(vm.element),
    errors: [],
    alert: {}
  }),
  computed: {
    answerType: vm => vm.element.data.type,
    isGraded: vm => vm.element.type === 'ASSESSMENT',
    showFeedback: vm => WITH_FEEDBACK.includes(vm.answerType),
    componentName: vm => resolveComponentName(vm.answerType),
    config: vm => vm.$teRegistry.get(vm.answerType),
    hintErrors: vm => getErrorMessages(vm.errors, 'hint'),
    schema() {
      const { schema } = this.config;
      return yup.object().shape({
        ...baseSchema,
        ...this.isGraded ? schema : omit(schema, ['correct'])
      });
    }
  },
  methods: {
    edit() {
      this.editedElement = cloneDeep(this.element);
      this.undoState = cloneDeep(this.element);
      this.isEditing = true;
    },
    update(data, validate) {
      Object.assign(this.editedElement.data, data);
      if (validate && !isEmpty(this.errors)) {
        this.errors = [];
        this.validate().catch(err => (this.errors = err.inner));
      }
      this.$emit('add', this.editedElement);
    },
    save() {
      this.validate().then(() => {
        this.$emit('save', cloneDeep(this.editedElement.data));
        this.isEditing = false;
        this.errors = [];
      }).catch(err => (this.errors = err.inner));
    },
    cancel() {
      if (!this.editedElement.id) return this.$emit('delete');
      this.$emit('add', cloneDeep(this.undoState));
      this.editedElement = cloneDeep(this.undoState);
      this.isEditing = false;
      this.errors = [];
      this.alert = {};
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
  min-height: 25rem;
  background-color: #fff;
  overflow: visible;
  text-align: left;

  ::v-deep .title {
    font-weight: 400;
  }

  .content {
    margin: 0.5rem 1.625rem;

    @media (max-width: 1263px) {
      margin: 0.5rem;
    }
  }

  .tce-answer {
    overflow: hidden;
  }
}

.disabled .controls {
  display: none;
}
</style>
