<template>
  <div class="question-container">
    <h4>Question</h4>
    <div
      :class="{ editing: isEditing, 'question-error': questionError }"
      class="question">
      <div class="row">
        <contained-content
          v-for="element in assessment.data.question"
          :key="element.id"
          :element="element"
          :isDisabled="!isEditing"
          @save="data => elementChanged(element, data)"
          @delete="deleteElement(element)"/>
      </div>
      <add-element
        v-show="isEditing"
        :include="['HTML', 'IMAGE', 'EMBED']"
        :layout="false"
        @add="addElement"/>
    </div>
    <span v-if="isEditing && helperText" class="help-block">
      {{ helperText }}
    </span>
  </div>
</template>

<script>
import AddElement from '../AddElement';
import cloneDeep from 'lodash/cloneDeep';
import { ContainedContent } from 'tce-core';
import findIndex from 'lodash/findIndex';
import { helperText } from 'utils/assessment';
import pullAt from 'lodash/pullAt';

export default {
  name: 'question',
  props: {
    assessment: { type: Object, required: true },
    errors: { type: Array, default: () => ([]) },
    isEditing: { type: Boolean, default: false }
  },
  computed: {
    helperText() {
      const helper = helperText[this.assessment.data.type] || {};
      return helper.question;
    },
    questionError() {
      return this.errors.includes('question');
    }
  },
  methods: {
    addElement(element) {
      const question = this.assessment.data.question.concat(element);
      this.$emit('update', { question });
    },
    elementChanged(element, data) {
      if (!this.isEditing) return;
      element = { ...element, data };
      const question = cloneDeep(this.assessment.data.question);
      const index = findIndex(question, { id: element.id });
      if (index < 0) return;
      question[index] = element;
      this.$emit('update', { question });
    },
    deleteElement(element) {
      const index = findIndex(this.assessment.data.question, { id: element.id });
      if (index === -1) return;
      let question = cloneDeep(this.assessment.data.question);
      pullAt(question, index);
      this.$emit('update', { question });
    }
  },
  components: {
    AddElement,
    ContainedContent
  }
};
</script>

<style lang="scss" scoped>
.question-container {
  clear: both;
  width: 100%;
  text-align: left;
}

.question {
  padding: 10px;
  font-size: 22px;
  text-align: center;

  &.question-error {
    box-shadow: inset 0 -2px 0 #e51c23;
  }
}
</style>
