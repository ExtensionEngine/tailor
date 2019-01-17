<template>
  <div class="select-element">
    <div
      v-if="!showAssessments"
      :style="{ 'max-width': maxWidth + 'px' }"
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
          <span :class="element.icon" class="mdi"></span>
          <span>{{ element.label }}</span>
        </div>
      </div>
    </div>
    <select-assessment
      v-if="showAssessments"
      :exclude="assessmentFilter"
      @selected="setSubtype"/>
  </div>
</template>

<script>
import chunk from 'lodash/chunk';
import filter from 'lodash/filter';
import first from 'lodash/first';
import get from 'lodash/get';
import { getLevel } from 'shared/activities';
import includes from 'lodash/includes';
import SelectAssessment from './SelectAssessment';

const TE_TYPES = [
  { type: 'HTML', label: 'Text', icon: 'mdi-format-text' },
  { type: 'IMAGE', label: 'Image', icon: 'mdi-image' },
  { type: 'VIDEO', label: 'Video', icon: 'mdi-video' },
  { type: 'BRIGHTCOVE_VIDEO', label: 'Brightcove Video', icon: 'mdi-video' },
  { type: 'ASSESSMENT', label: 'Question', icon: 'mdi-help' },
  { type: 'EMBED', label: 'Embed', icon: 'mdi-arrange-bring-forward' },
  { type: 'BREAK', label: 'Page Break', icon: 'mdi-format-page-break' },
  { type: 'ACCORDION', label: 'Accordion', icon: 'mdi-view-sequential' },
  { type: 'CAROUSEL', label: 'Carousel', icon: 'mdi-view-carousel' },
  { type: 'MODAL', label: 'Modal', icon: 'mdi-window-maximize' },
  { type: 'TABLE', label: 'Table', icon: 'mdi-table' },
  { type: 'PDF', label: 'PDF', icon: 'mdi-file-pdf-box' },
  { type: 'POLL', label: 'Poll', icon: 'mdi-poll-box' },
  { type: 'AUDIO', label: 'Audio', icon: 'mdi-volume-high' },
  { type: 'REFLECTION', label: 'Reflection', icon: 'mdi-comment-text' }
];

const ELEMENTS_PER_ROW = 6;

export default {
  name: 'select-element',
  props: {
    activity: { type: Object, default: null },
    include: { type: Array, default: null },
    rowSize: { type: Number, default: ELEMENTS_PER_ROW }
  },
  data() {
    return { type: null };
  },
  computed: {
    rows() {
      return chunk(this.elements, this.rowSize);
    },
    columns() {
      return Math.min(this.elements.length, this.rowSize);
    },
    elements() {
      if (!this.include) return TE_TYPES;
      return filter(TE_TYPES, it => includes(this.include, it.type));
    },
    showAssessments() {
      return this.type === 'ASSESSMENT';
    },
    assessmentFilter() {
      // Restrict TR within assessment block and exam.
      // Assessments are associated with outline activity.
      if (!this.activity) return;
      const outlineActivity = getLevel(this.activity.type);
      const examGroup = this.activity.type === 'ASSESSMENT_GROUP';
      if (outlineActivity || examGroup) return ['TR'];
    },
    columnWidth() {
      return `col-xs-${12 / this.columns}`;
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
    if (get(first(this.elements), 'type') === 'ASSESSMENT') {
      this.type = 'ASSESSMENT';
    }
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
