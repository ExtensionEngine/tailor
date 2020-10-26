<template>
  <div>
    <div class="subtitle-2 mb-2">Question</div>
    <div
      :class="['question-container', {
        focused: isFocused,
        disabled: !isEditing,
        incorrect: !!questionError
      }]">
      <draggable v-model="question" v-bind="dragOptions" class="row">
        <contained-content
          v-for="element in question" :key="element.id"
          @save="updateElement(element, $event)"
          @delete="deleteElement(element)"
          :element="element"
          :is-disabled="!isEditing"
          dense
          class="mb-4" />
      </draggable>
    </div>
    <add-element
      v-slot="{ addElement }"
      @add="addQuestionElement"
      :layout="false"
      :disabled="!isEditing"
      :include="['JODIT_HTML', 'IMAGE', 'EMBED', 'HTML']"
      :class="{ invisible: !isEditing }">
      <div class="d-flex justify-space-between mt-2 pl-3">
        <input-error :error="questionError" />
        <v-btn
          @click="addElement"
          text
          class="mt-2 ml-auto px-2">
          <v-icon dense class="mr-1">mdi-plus</v-icon>
          Add question element
        </v-btn>
      </div>
    </add-element>
  </div>
</template>

<script>
import { ContainedContent, InputError } from 'tce-core';
import AddElement from '../AddElement';
import cloneDeep from 'lodash/cloneDeep';
import Draggable from 'vuedraggable';
import find from 'lodash/find';
import findIndex from 'lodash/findIndex';
import { getErrorMessages } from 'utils/assessment';
import head from 'lodash/head';
import { mapChannels } from '@/plugins/radio';
import pullAt from 'lodash/pullAt';
import set from 'lodash/set';

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
  data: () => ({ isFocused: false }),
  computed: {
    ...mapChannels({ editorChannel: 'editor' }),
    question: {
      get() {
        return cloneDeep(this.assessment.data.question);
      },
      set(question) {
        this.$emit('update', { question });
      }
    },
    questionError: vm => head(getErrorMessages(vm.errors, 'question')),
    dragOptions: () => DRAG_OPTIONS
  },
  methods: {
    addQuestionElement(elements) {
      const question = cloneDeep(this.assessment.data.question);
      this.$emit('update', { question: question.concat(elements) });
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
  created() {
    this.editorChannel.on('element:focus', (element = {}) => {
      this.isFocused = !!find(this.question, { id: element.id });
    });
  },
  components: {
    AddElement,
    ContainedContent,
    Draggable,
    InputError
  }
};
</script>

<style lang="scss" scoped>
$disabled-color: rgba(0, 0, 0, 0.38);
$swing: cubic-bezier(0.25, 0.8, 0.5, 1);

.question-container {
  position: relative;
  min-height: 8.75rem;
  padding: 1rem 1.75rem 0;
  text-align: center;
  background: #ebebeb;
  border-radius: 0.125rem;
  transition: 0.3s $swing;

  &::before, &::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    width: 100%;
    transition: 0.3s $swing;
  }

  &::before {
    border-style: solid;
    border-width: thin 0 0 0;
  }

  &::after {
    border-style: solid;
    border-width: thin 0 thin 0;
    transform: scaleX(0);
  }

  &:not(.focused):not(.disabled):not(.incorrect):hover {
    background: #dcdcdc;

    ::v-deep .content-element {
      border-color: #bbb;
    }
  }
}

.focused::after {
  transform: scaleX(1);
}

.disabled::before {
  border-image:
    repeating-linear-gradient(
      to right,
      $disabled-color 0,
      $disabled-color 0.125rem,
      transparent 0.125rem,
      transparent 0.25rem
    ) 1 repeat;
}

.incorrect::before, .incorrect::after {
  border-color: var(--v-error-base);
}

.invisible {
  visibility: none;
}
</style>
