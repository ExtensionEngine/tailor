<template>
  <div class="add-element-container">
    <v-btn
      v-if="large"
      @click.stop="isVisible = true"
      color="blue-grey darken-3"
      text
      class="mt-3 mb-4">
      <v-icon class="pr-2">{{ icon }}</v-icon>{{ label }}
    </v-btn>
    <v-btn
      v-else
      @click.stop="isVisible = true"
      icon
      text
      color="blue-grey darken-3">
      <v-icon>{{ icon }}</v-icon>
    </v-btn>
    <v-bottom-sheet v-model="isVisible" max-width="1240" inset>
      <div class="element-container">
        <v-toolbar
          color="blue-grey darken-4"
          dense
          class="mb-2 elevation-1">
          <v-btn
            @click="showElementBrowser = !showElementBrowser"
            dark text
            class="ml-2">
            <v-icon class="mr-2">mdi-content-copy</v-icon>
            Copy existing
          </v-btn>
          <template v-if="layout">
            <v-spacer />
            <v-btn-toggle
              v-model="elementWidth"
              active-class="blue-grey darken-2"
              background-color="transparent"
              dark tile borderless mandatory>
              <v-btn :value="100" icon>
                <v-icon>mdi-square-outline</v-icon>
              </v-btn>
              <v-btn :value="50" icon>
                <v-icon>mdi-select-compare</v-icon>
              </v-btn>
            </v-btn-toggle>
            <v-divider class="mr-3" vertical />
            <div class="width-label px-1 subtitle-1 grey--text text--lighten-4">
              Element width
              <span class="px-1">{{ elementWidth }}</span>%
            </div>
          </template>
        </v-toolbar>
        <div
          v-for="group in library"
          :key="group.name">
          <div class="group-heading blue-grey--text text--darken-4">
            <span>{{ group.name }}</span>
          </div>
          <div class="group-elements">
            <button
              v-for="element in group.elements"
              :key="element.position"
              @click.stop="add(element)"
              :disabled="!allowedTypes.includes(element.type)"
              class="element">
              <v-icon v-if="element.ui.icon">{{ element.ui.icon }}</v-icon>
              <h5 class="body-2">{{ element.name }}</h5>
            </button>
          </div>
        </div>
      </div>
    </v-bottom-sheet>
    <select-element
      v-if="showElementBrowser"
      @selected="addElements"
      @close="showElementBrowser = false"
      :allowed-types="allowedTypes"
      heading="Select elements"
      multiple />
  </div>
</template>

<script>
import filter from 'lodash/filter';
import intersection from 'lodash/intersection';
import { isQuestion } from '../utils';
import reduce from 'lodash/reduce';
import reject from 'lodash/reject';
import sortBy from 'lodash/sortBy';
import uuid from '@/utils/uuid';

const SelectElement = () => import('components/common/SelectElement');

const DEFAULT_ELEMENT_WIDTH = 100;
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
    show: { type: Boolean, default: false },
    activity: { type: Object, default: null },
    position: { type: Number, default: null },
    layout: { type: Boolean, default: true },
    include: { type: Array, default: null },
    large: { type: Boolean, default: false },
    label: { type: String, default: 'Add content' },
    icon: { type: String, default: 'mdi-plus' }
  },
  data() {
    return {
      isVisible: false,
      elementWidth: DEFAULT_ELEMENT_WIDTH,
      showElementBrowser: false
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
      return filter(registry, { type: 'ASSESSMENT' })
        .concat(questions.map(it => ({ ...it, type: 'ASSESSMENT' })));
    },
    reflections() {
      const { registry, isSubset, include, questions } = this;
      if (isSubset && !include.includes('REFLECTION')) return [];
      return filter(registry, { type: 'REFLECTION' })
        .concat(questions.map(it => ({ ...it, type: 'REFLECTION' })));
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
    },
    allowedTypes() {
      const { elementWidth, include, layout, registry } = this;
      if (!layout) return include;
      const allowedElements = elementWidth === DEFAULT_ELEMENT_WIDTH
        ? registry
        : reject(registry, 'ui.forceFullWidth');
      const allowedTypes = allowedElements.map(it => it.type);
      return intersection(include, allowedTypes);
    }
  },
  methods: {
    addElements(elements) {
      elements.forEach(it => this.add(it));
    },
    add({ type, subtype, data = {}, initState = () => ({}) }) {
      const element = { type, data: { ...data, width: this.processedWidth } };
      // If content element within activity
      if (this.activity) {
        element.activityId = this.activity.id;
        element.position = this.position;
      } else {
        // If embed, assign id
        element.id = uuid();
        element.embedded = true;
      }
      if (isQuestion(element.type)) {
        const data = { width: LAYOUT.FULL_WIDTH };
        const question = [{ id: uuid(), data, type: 'JODIT_HTML', embedded: true }];
        element.data = { ...element.data, question, type: subtype };
      }
      element.data = { ...element.data, ...initState() };
      if (element.type === 'REFLECTION') delete element.data.correct;
      this.$emit('add', element);
      this.isVisible = false;
    },
    onHidden() {
      this.elementWidth = DEFAULT_ELEMENT_WIDTH;
      this.$emit('hidden');
    }
  },
  watch: {
    show(val) {
      if (val) this.isVisible = val;
    },
    isVisible(val, oldVal) {
      if (!val && oldVal) this.onHidden();
    }
  },
  components: { SelectElement }
};
</script>

<style lang="scss" scoped>
$font-color: #333;
$accent-color: #d81b60;
$disabled-color: #a1a1a1;

.element-container {
  min-height: 25rem;
  padding: 0 0 1.875rem;
  background: #fff;
}

.group-heading {
  margin: 0 2.5rem 0.375rem;
  padding-top: 1.25rem;
  font-size: 1rem;
  font-weight: 500;
  line-height: 1.75rem;
  text-align: left;

  .v-icon, span {
    line-height: 1.75rem;
    vertical-align: middle;
  }

  .v-icon {
    margin-right: 0.375rem;
    color: #546e7a;
  }
}

.group-elements {
  display: flex;
  width: 100%;
  padding: 0 1.875rem;
  flex-wrap: wrap;
}

.element {
  align-self: center;
  width: 8.125rem;
  min-width: 8.125rem;
  min-height: 4.375rem;
  padding: 0.375rem;
  color: $font-color;
  font-size: 1.25rem;
  border: 1px solid #fff;
  border-radius: 4px;
  outline: none;
  cursor: pointer;

  .v-icon {
    padding: 0.125rem 0;
    color: $font-color;
    font-size: 1.875rem;
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
    line-height: 1.25rem;
  }
}

.v-toolbar {
  .v-divider {
    align-self: auto;
  }

  .width-label {
    min-width: 11.25rem;
  }
}
</style>
