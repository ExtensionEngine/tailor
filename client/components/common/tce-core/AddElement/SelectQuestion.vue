<template>
  <v-container :grid-list-lg="true">
    <v-layout row wrap>
      <v-flex
        v-for="{ name, subtype } in questions"
        :key="subtype"
        v-bind="questionBindings"
        @click="$emit('selected', subtype)"
        align-self-center
        class="btn-base question-type">
        {{ name }}
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
const QUESTIONS_PER_ROW = 6;

export default {
  name: 'select-question',
  props: {
    questions: { type: Array, default: () => [] },
    exclude: { type: Array, default: () => ([]) },
    rowSize: { type: Number, default: QUESTIONS_PER_ROW }
  },
  computed: {
    elements() {
      const { exclude, questions } = this;
      if (!exclude.length) return questions;
      return questions.filter(it => !exclude.includes(it.type));
    },
    questionBindings() {
      const columns = Math.min(this.elements.length, this.rowSize);
      const columnWidth = Math.floor(12 / columns);
      return { [`xs${columnWidth}`]: true };
    }
  }
};
</script>

<style lang="scss" scoped>
.question-type {
  color: #444;
  font-size: 16px;
  line-height: 16px;

  &:hover {
    color: #42b983;
    cursor: pointer;
  }
}
</style>
