<template>
  <div class="question-container">
    <h4>Question</h4>
    <div
      :class="{ editing: isEditing, 'question-error': questionError }"
      class="question">
      <primitive
        v-for="element in assessment.data.question"
        :initialElement="element"
        :disabled="!isEditing"
        @save="elementChanged">
      </primitive>
      <add-element
        v-show="isEditing"
        :include="['HTML', 'IMAGE']"
        @add="addElement">
      </add-element>
    </div>
    <span v-if="isEditing && helperText" class="help-block">
      {{ helperText }}
    </span>
  </div>
</template>

<script>
import AddElement from '../../structure/AddElement';
import cloneDeep from 'lodash/cloneDeep';
import EventBus from 'EventBus';
import findIndex from 'lodash/findIndex';
import { helperText } from 'utils/assessment';
import pullAt from 'lodash/pullAt';
import Primitive from '../Primitive';

const appChannel = EventBus.channel('app');

export default {
  name: 'question',
  props: {
    assessment: Object,
    isEditing: Boolean,
    errors: Array
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
    elementChanged(element) {
      const question = cloneDeep(this.assessment.data.question);
      const index = findIndex(question, { id: element.id });
      question[index] = element;
      this.$emit('update', { question });
    }
  },
  created() {
    appChannel.on('deleteElement', element => {
      if (!element.embedded) return;
      const index = findIndex(this.assessment.data.question, { id: element.id });
      if (index === -1) return;
      let question = cloneDeep(this.assessment.data.question);
      pullAt(question, index);
      this.$emit('update', { question });
    });
  },
  components: {
    AddElement,
    Primitive
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
  font-size: 22px;
  text-align: center;
  padding: 10px;

  &.question-error {
    box-shadow: inset 0 -2px 0 #e51c23;
  }
}
</style>
