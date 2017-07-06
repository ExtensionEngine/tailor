<template>
  <li class="list-group-item assessment-item">
    <span class="drag-handle">
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
    cursor: pointer;

    &:hover {
      opacity: 1;
      transition: opacity .6s ease-in-out;
    }
  }

  .minimized {
    padding: 12px 20px;
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
    display: block;
    position: absolute;
    top: 3px;
    right: 15px;
    visibility: hidden;
    color: #707070;
    font-size: 26px;

    &:hover {
      color: #555;
    }
  }

  &:hover {
    .delete {
      visibility: visible;
    }
  }
}
</style>
