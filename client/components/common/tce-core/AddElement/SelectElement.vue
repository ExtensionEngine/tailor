<template>
  <div class="select-element">
    <div
      v-if="!showAssessments"
      :style="{ 'max-width': `${maxWidth}px` }"
      class="elements">
      <div
        v-for="(row, index) in rows"
        :key="index"
        class="row">
        <div
          v-for="element in row"
          :key="element.type"
          :class="columnWidth"
          @click="setType(element.type)"
          class="element-type">
          <span :class="element.ui.icon" class="mdi"></span>
          <span>{{ element.name }}</span>
        </div>
      </div>
    </div>
    <select-assessment
      v-if="showAssessments"
      :assessments="assessments"
      @selected="setSubtype"/>
  </div>
</template>

<script>
import chunk from 'lodash/chunk';
import filter from 'lodash/filter';
import includes from 'lodash/includes';
import SelectAssessment from './SelectAssessment';

const ELEMENTS_PER_ROW = 6;

export default {
  name: 'select-element',
  inject: ['$teRegistry'],
  props: {
    activity: { type: Object, default: null },
    include: { type: Array, default: null },
    rowSize: { type: Number, default: ELEMENTS_PER_ROW }
  },
  data() {
    return { type: null };
  },
  computed: {
    registry() {
      return this.$teRegistry.get();
    },
    rows() {
      return chunk(this.elements, this.rowSize);
    },
    columns() {
      return Math.min(this.elements.length, this.rowSize);
    },
    elements() {
      const result = filter(this.registry, it => it.type !== 'ASSESSMENT');
      if (this.assessments.length) {
        result.push({
          name: 'Assessment', type: 'ASSESSMENT', ui: { icon: 'mdi-help' }
        });
      }
      if (!this.include) return result;
      return filter(result, it => includes(this.include, it.type));
    },
    assessments() {
      return filter(this.registry, { type: 'ASSESSMENT' });
    },
    showAssessments() {
      return this.type === 'ASSESSMENT';
    },
    columnWidth() {
      return `col-xs-${Math.floor(12 / this.columns)}`;
    },
    maxWidth() {
      // Set the maximum width of the select component container in the
      // increments of 150px, with the baseline of 2 elements having 200px width
      return 200 + (this.columns - 2) * 150;
    }
  },
  methods: {
    setType(type) {
      if (type === 'ASSESSMENT') {
        this.type = type;
        return;
      }
      this.$emit('selected', { type });
      this.close();
    },
    setSubtype(subtype) {
      this.$emit('selected', { type: this.type, subtype });
      this.close();
    },
    close() {
      this.type = null;
    }
  },
  created() {
    const assessments = filter(this.elements, { type: 'ASSESSMENT' });
    if (assessments.length === this.elements.length) this.type = 'ASSESSMENT';
  },
  components: { SelectAssessment }
};
</script>

<style lang="scss" scoped>
.select-element {
  margin: 0 auto;
}

.elements {
  margin: 0 auto;

  .row {
    padding-bottom: 30px;
  }
}

.element-type {
  &:hover {
    color: #42b983;
    cursor: pointer;
  }

  span {
    display: block;
    font-size: 16px;
  }

  .mdi {
    padding-bottom: 7px;
    font-size: 30px;
  }
}
</style>
