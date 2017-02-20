<template>
  <li class="list-group-item assessment-item">
    <assessment
      v-if="edit"
      :init-assessment="assessment"
      @selected="$emit('selected')"
      @remove="$emit('remove')"
      @save="$emit('save', $event)">
    </assessment>
    <div v-else @click="$emit('selected')" class="minimized">
      <span class="label label-success">{{ assessment.type }}</span>
      <span class="title">{{ question }}</span>
      <button @click.stop="$emit('remove')" type="button" class="delete">
        <span class="fa fa-times"></span>
      </button>
    </div>
  </li>
</template>

<script>
import Assessment from '../assessments';
import truncate from 'lodash/truncate';

const htmlRegex = /<\/?[^>]+(>|$)/g;
const blankRegex = /(@blank)/g;
const options = { length: 50 };

export default {
  name: 'assessment-item',
  props: ['assessment', 'edit'],
  computed: {
    question() {
      let question = this.assessment.question || '';
      let index = 0;
      const newValue = () => `(${++index})`;
      const parsedQuestion = question.replace(htmlRegex, '').replace(blankRegex, newValue);
      return truncate(parsedQuestion, options);
    }
  },
  components: {
    Assessment
  }
};
</script>

<style lang="scss" scoped>
.assessment-item {
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.14);
  margin-bottom: 7px;
  padding: 0;

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
  }

  .delete {
    visibility: hidden;
    float: right;
    opacity: 0.5;
    border: 0;
    background-color: transparent;
    padding: 0;

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
