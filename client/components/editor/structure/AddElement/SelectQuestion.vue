<template>
  <div class="select-question">
    <div
      v-for="question in questions"
      @click="$emit('selected', question.type)"
      class="btn-base question-type">
      <span>{{ question.title }}</span>
    </div>
  </div>
</template>

<script>
import { typeInfo } from 'utils/assessment';

export default {
  name: 'select-question',
  data() {
    return { questions: typeInfo };
  }
};
</script>

<style lang="scss" scoped>
.select-question {
  margin: 15px 0;
  color: #444;

  .btn-base {
    display: inline-block;
    font-size: 28px;
    line-height: 28px;
    vertical-align: middle;

    &:hover {
      color: #42b983;
      cursor: pointer;
    }
  }

  .question-type {
    margin: 0 15px;
    font-size: 16px;
    line-height: 16px;
  }
}
</style>
