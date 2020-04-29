<template>
  <v-sheet class="question-container grey lighten-4 elevation-1 pa-5 mb-4">
    <span class="subtitle-2 grey--text text--darken-4">
      {{ title }}
    </span>
    <div :class="['question', { 'question-error': questionError }]">
      <draggable v-model="question" v-bind="dragOptions" class="row">
        <contained-content
          v-for="element in question" :key="element.id"
          @save="updateElement(element, $event)"
          @delete="deleteElement(element)"
          :element="element"
          :is-disabled="!isEditing"
          dense />
      </draggable>
      <add-element
        @add="addElement"
        :layout="false"
        :disabled="!isEditing"
        :include="['JODIT_HTML', 'IMAGE', 'EMBED', 'HTML']"
        :class="['add-element', { invisible: !isEditing }]"
        label="Add question block"
        large />
    </div>
    <span v-if="isEditing && helperText" class="help-block">
      {{ helperText }}
    </span>
  </v-sheet>
</template>

<script>
import AddElement from '../AddElement';
import cloneDeep from 'lodash/cloneDeep';
import { ContainedContent } from 'tce-core';
import Draggable from 'vuedraggable';
import findIndex from 'lodash/findIndex';
import get from 'lodash/get';
import { helperText } from 'utils/assessment';
import pullAt from 'lodash/pullAt';
import set from 'lodash/set';

const TITLE = 'Question';
const DRAG_OPTIONS = {
  handle: '.drag-handle',
  scrollSensitivity: 125,
  scrollSpeed: 15
};

export default {
  name: 'question',
  props: {
    assessment: { type: Object, required: true },
    errors: { type: Array, default: () => ([]) },
    isEditing: { type: Boolean, default: false }
  },
  computed: {
    question: {
      get() {
        return cloneDeep(this.assessment.data.question);
      },
      set(question) {
        this.$emit('update', { question });
      }
    },
    helperText: vm => get(helperText[vm.assessment.data.type], 'question'),
    questionError: vm => vm.errors.includes('question'),
    dragOptions: () => DRAG_OPTIONS,
    title: () => TITLE
  },
  methods: {
    addElement(element) {
      const question = cloneDeep(this.assessment.data.question);
      this.$emit('update', { question: question.concat(element) });
    },
    updateElement(element, data) {
      if (!this.isEditing) return;
      const question = cloneDeep(this.assessment.data.question);
      const index = findIndex(question, { id: element.id });
      if (index === -1) return;
      element = { ...question[index], data };
      this.$emit('update', { question: set(question, index, element) });
    },
    deleteElement(element) {
      const question = cloneDeep(this.assessment.data.question);
      const index = findIndex(question, { id: element.id });
      if (index === -1) return;
      pullAt(question, index);
      this.$emit('update', { question });
    }
  },
  components: {
    AddElement,
    ContainedContent,
    Draggable
  }
};
</script>

<style lang="scss" scoped>
.question-container {
  clear: both;
  margin: 0 1.5rem;

  @media (max-width: 1263px) {
    margin: 0;
  }

  .question {
    padding: 0.8rem 0.8rem 0;
    font-size: 1.375rem;
    text-align: center;

    .add-element {
      margin-top: 0.4rem;
    }

    .invisible {
      visibility: none;
    }
  }

  .question-error {
    box-shadow: inset 0 -0.125rem 0 #e51c23;
  }
}
</style>
