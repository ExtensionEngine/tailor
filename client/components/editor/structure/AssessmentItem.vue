<template>
  <li
    :class="{ hover }"
    @mouseenter="hover = true"
    @mouseleave="hover = false"
    class="list-group-item assessment-item">
    <span v-if="exam" class="drag-handle">
      <span class="mdi mdi-drag-vertical"></span>
    </span>
    <te-assessment
      v-if="expanded"
      :element="assessment"
      :exam="exam"
      :summative="true"
      @selected="$emit('selected')"
      @remove="$emit('remove')"
      @save="$emit('save', $event)">
    </te-assessment>
    <div v-else @click="$emit('selected')" class="minimized">
      <span class="label label-success">{{ assessment.data.type }}</span>
      <span class="title">{{ question }}</span>
      <span @click.stop="$emit('remove')" class="delete">
        <span class="mdi mdi-close"></span>
      </span>
    </div>
  </li>
</template>

<script>
import filter from 'lodash/filter';
import map from 'lodash/map';
import TeAssessment from '../teaching-elements/Assessment';
import truncate from 'lodash/truncate';

const blankRegex = /(@blank)/g;
const htmlRegex = /<\/?[^>]+(>|$)/g;

export default {
  name: 'assessment-item',
  props: ['assessment', 'exam', 'expanded'],
  computed: {
    question() {
      let question = filter(this.assessment.data.question, { type: 'HTML' });
      question = map(question, 'data.content').join(' ');
      question = question.replace(htmlRegex, '').replace(blankRegex, () => `____`);
      return truncate(question, { length: 50 });
    }
  },
  data() {
    return { hover: false };
  },
  components: {
    TeAssessment
  }
};
</script>

<style lang="scss" scoped>
.assessment-item {
  margin-bottom: 7px;
  padding: 0;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.14);

  &, &:first-child, &:last-child {
    border-radius: 0;
  }

  .drag-handle {
    position: absolute;
    top: 0;
    left: -3px;
    font-size: 28px;
    color: #888;
    opacity: 0;
    cursor: move;
  }

  &.hover .drag-handle {
    opacity: 1;
    transition: opacity .6s ease-in-out;
  }

  .minimized {
    padding: 12px 22px;
    &:hover { cursor: pointer; }
  }

  .title {
    display: inline-block;
    height: 19px;
    max-width: 80%;
  }

  .label {
    float: left;
    min-width: 30px;
    padding: 3px 5px;
    font-size: 11px;
  }

  .delete {
    display: inline-block;
    position: absolute;
    right: 15px;
    font-size: 18px;
    line-height: 18px;
    visibility: hidden;
    color: #707070;

    &:hover { color: #555; }
  }

  &.hover:not(.sortable-chosen) .delete {
    visibility: visible;
  }
}
</style>
