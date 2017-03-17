<template>
  <li class="list-group-item assessment-item">
    <te-assessment
      v-if="expanded"
      :element="assessment"
      @selected="$emit('selected')"
      @remove="$emit('remove')"
      @save="$emit('save', $event)">
    </te-assessment>
    <div v-else @click="$emit('selected')" class="minimized">
      <span class="label label-success">{{ assessment.data.type }}</span>
      <span class="title">{{ question }}</span>
      <button @click.stop="$emit('remove')" class="delete" type="button">
        <span class="fa fa-times"></span>
      </button>
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
  props: ['assessment', 'expanded'],
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

  div {
    padding: 15px;
  }

  .minimized:hover {
    cursor: pointer;
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
    visibility: hidden;
    float: right;
    padding: 0;
    opacity: 0.5;
    border: 0;
    background-color: transparent;

    span {
      font-size: 20px;
    }
  }

  .delete:focus {
    outline: none;
  }

  div:hover {
    .delete:enabled {
      visibility: visible;
    }
  }
}
</style>
