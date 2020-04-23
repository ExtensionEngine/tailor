<template>
  <div class="feedback">
    <span class="title">Feedback</span>
    <v-btn
      @click="isExpanded = !isExpanded"
      text small class="mb-1 mx-2">
      {{ isExpanded ? 'hide' : 'show' }}
    </v-btn>
    <transition name="fade">
      <ul v-if="isExpanded">
        <feedback-item
          v-for="(answer, index) in processedAnswers"
          :key="index"
          @update="({ html }) => $emit('update', { [index]: html })"
          v-bind="{
            index,
            answer,
            isEditing,
            isGraded,
            feedback: feedback[index]
          }" />
      </ul>
    </transition>
  </div>
</template>

<script>
import FeedbackItem from './FeedbackItem';
import isArray from 'lodash/isArray';

export default {
  name: 'feedback',
  props: {
    answers: { type: [Array, Boolean], default: null },
    feedback: { type: Object, default: () => ({}) },
    isGraded: { type: Boolean, default: false },
    isEditing: { type: Boolean, default: false }
  },
  data: vm => ({
    isExpanded: vm.isEditing
  }),
  computed: {
    processedAnswers: vm => isArray(vm.answers) ? vm.answers : ['True', 'False']
  },
  watch: {
    isEditing(val) {
      if (val) this.isExpanded = true;
    }
  },
  components: { FeedbackItem }
};
</script>

<style lang="scss" scoped>
ul {
  margin-top: 20px;
  list-style: none;
}
</style>
