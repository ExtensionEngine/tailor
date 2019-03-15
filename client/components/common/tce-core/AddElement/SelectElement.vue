<template>
  <div class="select-element">
    <select-assessment
      v-if="showAssessments"
      :assessments="assessments"
      @selected="setSubtype"/>
    <v-container v-else :grid-list-lg="true" fluid class="py-3 px-2">
      <v-layout row wrap>
        <v-flex
          v-for="{ name, type, ui } in elements"
          :key="type"
          v-bind="elementBindings"
          @click="setType(type)"
          class="element-type">
          <v-icon class="element-icon" medium>
            {{ ui.icon }}
          </v-icon>
          <div class="element-name">
            {{ name }}
          </div>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import filter from 'lodash/filter';
import includes from 'lodash/includes';
import SelectAssessment from './SelectAssessment';

const ASSESSMENT = 'ASSESSMENT';
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
    elements() {
      const result = filter(this.registry, it => it.type !== ASSESSMENT);
      if (this.assessments.length) {
        result.push({
          name: 'Assessment', type: ASSESSMENT, ui: { icon: 'mdi-help' }
        });
      }
      if (!this.include) return result;
      return filter(result, it => includes(this.include, it.type));
    },
    assessments() {
      return filter(this.registry, { type: ASSESSMENT });
    },
    showAssessments() {
      return this.type === ASSESSMENT;
    },
    elementBindings() {
      const columns = Math.min(this.elements.length, this.rowSize);
      const columnWidth = Math.floor(12 / columns);
      return { [`xs${columnWidth}`]: true };
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
    const assessments = filter(this.elements, { type: ASSESSMENT });
    if (assessments.length === this.elements.length) this.type = ASSESSMENT;
  },
  components: { SelectAssessment }
};
</script>

<style lang="scss" scoped>
.elements {
  margin: 0 auto;

  .element-container {
    padding-bottom: 10px;
  }
}

.element-type {
  font-size: 16px;
  cursor: pointer;

  .element-icon {
    color: #444;
  }

  &:hover {
    .element-icon, .element-name {
      color: #42b983;
    }
  }
}
</style>
