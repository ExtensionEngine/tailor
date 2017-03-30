<template>
  <div class="select-element">
    <div v-if="!showAssessments">
      <div
        v-for="element in elements"
        @click="setType(element.type)"
        class="element-type">
        <span class="mdi" :class="element.icon"></span>
        <span>{{ element.label }}</span>
      </div>
    </div>
    <select-assessment
      v-if="showAssessments"
      @selected="setSubtype">
    </select-assessment>
  </div>
</template>

<script>
import filter from 'lodash/filter';
import SelectAssessment from './SelectAssessment';

const TE_TYPES = [
  { type: 'HTML', label: 'Text', icon: 'mdi-format-text' },
  { type: 'IMAGE', label: 'Image', icon: 'mdi-image' },
  { type: 'VIDEO', label: 'Video', icon: 'mdi-video' },
  { type: 'ASSESSMENT', label: 'Question', icon: 'mdi-help' },
  { type: 'EMBED', label: 'Embed', icon: 'mdi-arrange-bring-forward' },
  { type: 'BREAK', label: 'Page Break', icon: 'mdi-format-page-break' },
  { type: 'ACCORDION', label: 'Accordion', icon: 'mdi-view-sequential' }
];

export default {
  name: 'select-element',
  props: ['include'],
  data() {
    return { type: null };
  },
  computed: {
    elements() {
      if (!this.include) return TE_TYPES;
      let items = filter(TE_TYPES, it => this.include.indexOf(it.type) > -1);
      if (items.length === 1 && items[0].type === 'ASSESSMENT') {
        this.type = 'ASSESSMENT';
      }

      return items;
    },
    showAssessments() {
      return this.type === 'ASSESSMENT';
    }
  },
  methods: {
    setType(type) {
      if (type !== 'ASSESSMENT') {
        this.$emit('selected', { type });
        this.close();
      } else {
        this.type = type;
      }
    },
    setSubtype(subtype) {
      this.$emit('selected', { type: this.type, subtype });
      this.close();
    },
    close() {
      this.type = null;
    }
  },
  components: {
    SelectAssessment
  }
};
</script>

<style lang="scss" scoped>
.select-element {
  display: inline-block;
}

.element-type {
  display: inline-block;
  margin: 0 20px;
  padding: 5px 10px;

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
