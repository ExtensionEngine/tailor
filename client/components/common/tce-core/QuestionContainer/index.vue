<template>
  <v-card class="tce-question-container grey lighten-5">
    <v-toolbar
      color="grey darken-3"
      height="36"
      dark
      class="mb-5 px-0 elevation-2 text-left">
      <v-icon color="secondary lighten-2" size="16" class="mr-1">mdi-help</v-icon>
      <span class="subtitle-2">{{ conifg.name }}</span>
    </v-toolbar>
    <slot :isEditing="isEditing"></slot>
    <question
      @update="update"
      :assessment="editedElement"
      :is-editing="isEditing"
      :errors="errors" />
    <component
      :is="resolveComponentName(element)"
      @update="update"
      @alert="alert = $event"
      :assessment="editedElement.data"
      :is-editing="isEditing"
      :is-graded="isGraded"
      :errors="errors"
      class="tce-answer" />
    <div class="px-7">
      <v-text-field
        v-model="editedElement.data.hint"
        :label="hintTitle"
        :errors="hintError"
        :disabled="!isEditing"
        filled />
      <feedback
        v-if="showFeedback"
        @update="updateFeedback"
        :answers="editedElement.data.answers"
        :feedback="editedElement.data.feedback"
        :is-graded="isGraded"
        :is-editing="isEditing" />
      <v-alert v-show="alert.text" :type="alert.type" dense class="mt-4">
        {{ alert.text }}
      </v-alert>
      <controls
        @edit="edit"
        @save="save"
        @remove="remove"
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
import dropRight from 'lodash/dropRight';
import Feedback from './Feedback';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import last from 'lodash/last';
import map from 'lodash/map';
import omit from 'lodash/omit';
import Question from './Question';
import toPath from 'lodash/toPath';

const WITH_FEEDBACK = ['MC', 'SC', 'TF'];
const TEXT_CONTAINERS = ['JODIT_HTML', 'HTML'];
const validationOptions = { recursive: true, abortEarly: false };

const HINT_TITLE = 'Hint';
const HINT_PLACEHOLDER = 'Optional hint';

export default {
  name: 'tce-question-container',
  inject: ['$teRegistry'],
  props: {
    element: { type: Object, required: true }
  },
  data: vm => ({
    isEditing: !vm.element.id,
    editedElement: cloneDeep(vm.element),
    undoState: cloneDeep(vm.element),
    errors: [],
    alert: {}
  }),
  computed: {
    conifg: vm => vm.$teRegistry.get(vm.answerType),
    schema() {
      const elementSchema = this.conifg.schema;
      return yup.object().shape({
        ...baseSchema,
        ...this.isGraded ? elementSchema : omit(elementSchema, ['correct'])
      });
    },
    answerType: vm => vm.element.data.type,
    isGraded: vm => vm.element.type === 'ASSESSMENT',
    showFeedback: vm => WITH_FEEDBACK.includes(vm.answerType),
    hintError: vm => vm.errors.includes('hint'),
    hintPlaceholder: () => HINT_PLACEHOLDER,
    hintTitle: () => HINT_TITLE
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
      this.errors = [];
      this.alert = {};
    },
    remove() {
      this.$emit('remove');
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
  min-height: 25rem;
  background-color: #fff;
  overflow: visible;
  text-align: left;

  ::v-deep .title {
    font-weight: 400;
  }

  .tce-answer {
    margin: 0 1.75rem;
    overflow: hidden;

    @media (max-width: 1263px) {
      margin: 0 0.25rem;
    }
  }

  .hint, .feedback, .v-alert {
    margin: 1rem 3rem;

    @media (max-width: 1263px) {
      margin: 1rem 0.25rem;
    }
  }
}

.disabled .controls {
  display: none;
}
</style>
