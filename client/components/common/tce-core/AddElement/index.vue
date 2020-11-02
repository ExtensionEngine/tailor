<template>
  <div class="add-element-container">
    <slot :addElement="showElementPicker">
      <v-btn
        v-if="large"
        @click.stop="showElementPicker"
        color="blue-grey darken-3"
        text
        class="mt-3 mb-4">
        <v-icon class="pr-2">{{ icon }}</v-icon>{{ label }} asd
      </v-btn>
      <v-btn
        v-else
        @click.stop="showElementPicker"
        color="blue-grey darken-3"
        icon text>
        <v-icon>{{ icon }}</v-icon>
      </v-btn>
    </slot>
    <template v-if="isVisible">
      <select-element
        v-if="showElementBrowser"
        @selected="addElements"
        @close="showElementBrowser = false"
        :allowed-types="allowedTypes"
        submit-label="Copy"
        heading="Copy elements"
        header-icon="mdi-content-duplicate"
        multiple />
      <add-new-element
        v-else
        v-model="isVisible"
        @add="addElements"
        :library="library"
        :allowed-types="allowedTypes">
        <template v-slot:header>
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
        </template>
      </add-new-element>
    </template>
  </div>
</template>

<script>
import AddNewElement from './AddNewElement';
import filter from 'lodash/filter';
import flatMap from 'lodash/flatMap';
import intersection from 'lodash/intersection';
import { isQuestion } from '../utils';
import pick from 'lodash/pick';
import reduce from 'lodash/reduce';
import reject from 'lodash/reject';
import uuid from '@/utils/uuid';

const SelectElement = () => import('components/common/SelectElement');

const DEFAULT_ELEMENT_WIDTH = 100;
const LAYOUT = { HALF_WIDTH: 6, FULL_WIDTH: 12 };
const ELEMENT_GROUPS = [
  { name: 'Content Elements', icon: 'mdi-set-center' },
  { name: 'Assessments', icon: 'mdi-help-rhombus' },
  { name: 'Nongraded questions', icon: 'mdi-comment-question-outline' }
];

const getQuestionData = (element, type) => {
  const data = { width: LAYOUT.FULL_WIDTH };
  const question = [{ id: uuid(), data, type: 'JODIT_HTML', embedded: true }];
  return { question, type, ...element.data };
};

export default {
  name: 'add-element',
  inject: ['$teRegistry'],
  props: {
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
      return this.$teRegistry.all;
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
      const { elementWidth, include, layout, library } = this;
      const elements = flatMap(library, 'elements');
      if (!layout) return include;
      const allowedElements = elementWidth === DEFAULT_ELEMENT_WIDTH
        ? elements
        : reject(elements, 'ui.forceFullWidth');
      const allowedTypes = allowedElements.map(it => it.type);
      return include ? intersection(include, allowedTypes) : allowedTypes;
    }
  },
  methods: {
    addElements(elements) {
      const items = elements.map((it, index) => {
        const position = this.position + index;
        return this.buildElement({ ...it, position });
      });
      this.$emit('add', items);
      this.isVisible = false;
    },
    buildElement(el) {
      const { position, processedWidth: width, activity } = this;
      const { subtype, data = {}, initState = () => ({}) } = el;
      const element = {
        position,
        ...pick(el, ['type', 'refs']),
        data: { ...initState(), ...data, width }
      };
      const contextData = activity
        ? { activityId: activity.id } // If content element within activity
        : { id: uuid(), embedded: true }; // If embed, assign id
      Object.assign(element, contextData);
      if (isQuestion(element.type)) element.data = getQuestionData(element, subtype);
      if (element.type === 'REFLECTION') delete element.data.correct;
      return element;
    },
    onHidden() {
      this.elementWidth = DEFAULT_ELEMENT_WIDTH;
      this.$emit('hidden');
    },
    showElementPicker() {
      this.isVisible = true;
    }
  },
  watch: {
    isVisible(val, oldVal) {
      if (!val && oldVal) this.onHidden();
    }
  },
  components: { AddNewElement, SelectElement }
};
</script>
