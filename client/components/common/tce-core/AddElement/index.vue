<template>
  <div class="add-element-container">
    <v-btn @click.stop="isVisible = true" icon flat color="blue-grey darken-2">
      <v-icon>mdi-plus</v-icon>
    </v-btn>
    <v-bottom-sheet v-model="isVisible" max-width="1240" inset lazy>
      <div class="element-container">
        <v-toolbar v-if="layout" dense class="mb-2">
          <v-spacer/>
          <v-divider vertical class="mx-2"/>
          <v-btn-toggle v-model="elementWidth" mandatory>
            <v-btn :value="100" flat>
              <v-icon>mdi-square-outline</v-icon>
            </v-btn>
            <v-btn :value="50" flat>
              <v-icon>mdi-select-compare</v-icon>
            </v-btn>
          </v-btn-toggle>
          <v-divider class="mx-2" vertical/>
          <v-chip label class="width-label">
            <span>Element width:</span>
            <span class="label-value px-1">{{ elementWidth }}</span>%
          </v-chip>
        </v-toolbar>
        <div
          v-for="group in library"
          :key="group.name">
          <div class="group-heading">
            <v-icon>{{ group.icon }}</v-icon>
            <span>{{ group.name }}</span>
          </div>
          <div class="group-elements">
            <button
              v-for="element in group.elements"
              :key="element.position"
              :disabled="isElementDisabled(element)"
              @click.stop="add(element)"
              class="element">
              <v-icon v-if="element.ui.icon">{{ element.ui.icon }}</v-icon>
              <h5 class="body-2">{{ element.name }}</h5>
            </button>
          </div>
        </div>
      </div>
    </v-bottom-sheet>
  </div>
</template>

<script>
import cuid from 'cuid';
import filter from 'lodash/filter';
import get from 'lodash/get';
import { isQuestion } from '../utils';
import reduce from 'lodash/reduce';
import sortBy from 'lodash/sortBy';

const LAYOUT = { HALF_WIDTH: 6, FULL_WIDTH: 12 };
const ELEMENT_GROUPS = [
  { name: 'Content Elements', icon: 'mdi-set-center' },
  { name: 'Assessments', icon: 'mdi-help-rhombus' },
  { name: 'Nongraded questions', icon: 'mdi-comment-question-outline' }
];

export default {
  name: 'add-element',
  inject: ['$teRegistry'],
  props: {
    activity: { type: Object, default: null },
    position: { type: Number, default: null },
    layout: { type: Boolean, default: true },
    include: { type: Array, default: null },
    show: { type: Boolean, default: false }
  },
  data() {
    return {
      isVisible: false,
      elementWidth: 100
    };
  },
  computed: {
    registry() {
      return sortBy(this.$teRegistry.get(), 'position');
    },
    questions() {
      return filter(this.registry, { type: 'QUESTION' });
    },
    contentElements() {
      const items = filter(this.registry, it => !isQuestion(it.type));
      if (!this.isSubset) return items;
      return filter(items, it => this.include.includes(it.type));
    },
    assessments() {
      const { registry, isSubset, include, questions } = this;
      if (isSubset && !include.includes('ASSESSMENT')) return [];
      return filter(registry, { type: 'ASSESSMENT' }).concat(questions);
    },
    reflections() {
      const { registry, isSubset, include, questions } = this;
      if (isSubset && !include.includes('REFLECTION')) return [];
      return filter(registry, { type: 'REFLECTION' }).concat(questions);
    },
    isSubset() {
      return !!this.include && !!this.include.length;
    },
    library() {
      const groups = [this.contentElements, this.assessments, this.reflections];
      return reduce(groups, (acc, elements, i) => {
        if (elements.length) acc.push({ ...ELEMENT_GROUPS[i], elements });
        return acc;
      }, []);
    },
    processedWidth() {
      return this.elementWidth === 50 ? LAYOUT.HALF_WIDTH : LAYOUT.FULL_WIDTH;
    }
  },
  methods: {
    add({ type, subtype, initState = () => ({}) }) {
      const element = { type, data: { width: this.processedWidth } };
      // If teaching element within activity
      if (this.activity) {
        element.activityId = this.activity.id;
        element.position = this.position;
      } else {
        // If embed, assign id
        element.id = cuid();
        element.embedded = true;
      }
      if (isQuestion(element.type)) {
        const data = { width: LAYOUT.FULL_WIDTH };
        const question = [{ id: cuid(), data, type: 'HTML', embedded: true }];
        element.data = { ...element.data, question, type: subtype };
      }
      element.data = { ...element.data, ...initState() };
      if (element.type === 'REFLECTION') delete element.data.correct;
      this.$emit('add', element);
      this.isVisible = false;
    },
    isElementDisabled(element) {
      if (this.elementWidth === 100) return false;
      return get(element, 'ui.forceFullWidth', false);
    }
  },
  watch: {
    show(val) {
      if (val) this.isVisible = val;
    },
    isVisible(val, oldVal) {
      if (!val && oldVal) this.$emit('hide');
    }
  }
};
</script>

<style lang="scss" scoped>
$font-color: #333;
$accent-color: #d81b60;
$disabled-color: #a1a1a1;

.element-container {
  min-height: 400px;
  padding: 0 0 30px;
  background: #fff;
}

.group-heading {
  margin: 0 26px 5px;
  padding-top: 10px;
  color: #555;
  font-size: 16px;
  font-weight: 500;
  line-height: 28px;
  text-align: left;

  .v-icon, span {
    line-height: 28px;
    vertical-align: middle;
  }

  .v-icon {
    margin-right: 6px;
    color: #546e7a;
  }
}

.group-elements {
  display: flex;
  width: 100%;
  padding: 0 20px;
  flex-wrap: wrap;
}

.element {
  align-self: center;
  width: 130px;
  min-width: 130px;
  min-height: 70px;
  padding: 5px;
  color: $font-color;
  font-size: 20px;
  border: 1px solid #fff;
  border-radius: 4px;
  outline: none;
  cursor: pointer;

  .v-icon {
    padding: 2px 0;
    color: $font-color;
    font-size: 30px;
  }

  &:disabled {
    color: $disabled-color;
    cursor: not-allowed;

    .v-icon {
      color: $disabled-color;
    }
  }

  &:enabled:hover {
    color: $accent-color;
    background: #fcfcfc;
    border: 1px solid #888;

    .v-icon {
      color: $accent-color;
    }
  }

  &-title {
    margin: 0;
    padding: 0;
    font-weight: 500;
    line-height: 20px;
  }
}

.v-toolbar {
  .v-divider {
    align-self: auto;
  }

  .width-label {
    min-width: 165px;
    font-size: 14px;
    font-weight: 500;
  }

  .label-value {
    color: $accent-color;
  }
}
</style>
