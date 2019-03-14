<template>
  <v-container :grid-list-lg="true">
    <v-layout row wrap>
      <v-flex
        v-for="{ name, subtype } in assessments"
        :key="subtype"
        v-bind="assessmentBindings"
        @click="$emit('selected', subtype)"
        align-self-center
        class="btn-base assessment-type">
        {{ name }}
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
const ASSESSMENTS_PER_ROW = 6;

export default {
  name: 'select-assessment',
  props: {
    assessments: { type: Array, default: () => [] },
    exclude: { type: Array, default: () => ([]) },
    rowSize: { type: Number, default: ASSESSMENTS_PER_ROW }
  },
  computed: {
    elements() {
      const { exclude, assessments } = this;
      if (!exclude.length) return assessments;
      return assessments.filter(it => !exclude.includes(it.type));
    },
    assessmentBindings() {
      const columns = Math.min(this.elements.length, this.rowSize);
      const columnWidth = Math.floor(12 / columns);
      return { [`xs${columnWidth}`]: true };
    }
  }
};
</script>

<style lang="scss" scoped>
.assessment-type {
  color: #444;
  font-size: 16px;
  line-height: 16px;

  &:hover {
    color: #42b983;
    cursor: pointer;
  }
}
</style>
