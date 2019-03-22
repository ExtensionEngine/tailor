<template>
  <div class="select-element">
    <select-question
      v-if="showQuestions"
      :questions="questions"
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
import countBy from 'lodash/countBy';
import filter from 'lodash/filter';
import includes from 'lodash/includes';
import { isQuestion } from '../utils';
import SelectQuestion from './SelectQuestion';
import sortBy from 'lodash/sortBy';

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
      return sortBy(this.$teRegistry.get(), 'position');
    },
    elements() {
      const result = filter(this.registry, it => !isQuestion(it.type));
      const elementTypes = countBy(this.registry, 'type');
      if (elementTypes.QUESTION || elementTypes.ASSESSMENT) {
        result.push({
          name: 'Assessment',
          type: 'ASSESSMENT',
          ui: { icon: 'mdi-help' }
        });
      }
      if (elementTypes.QUESTION || elementTypes.REFLECTION) {
        result.push({
          name: 'Reflection',
          type: 'REFLECTION',
          ui: { icon: 'mdi-comment-question-outline' }
        });
      }
      if (!this.include) return result;
      return filter(result, it => includes(this.include, it.type));
    },
    questions() {
      if (!this.showQuestions) return [];
      const types = ['QUESTION', this.type];
      return filter(this.registry, it => types.includes(it.type));
    },
    showQuestions() {
      return isQuestion(this.type);
    },
    elementBindings() {
      const columns = Math.min(this.elements.length, this.rowSize);
      const columnWidth = Math.floor(12 / columns);
      return { [`xs${columnWidth}`]: true };
    }

  },
  methods: {
    setType(type) {
      if (isQuestion(type)) {
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
    const reflections = filter(this.elements, { type: 'REFLECTION' });
    if (assessments.length === this.elements.length) this.type = 'ASSESSMENT';
    if (reflections.length === this.elements.length) this.type = 'REFLECTION';
  },
  components: { SelectQuestion }
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
