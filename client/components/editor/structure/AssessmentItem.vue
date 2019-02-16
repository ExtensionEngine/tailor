<template>
  <li
    :class="{ hover }"
    @mouseenter="hover = true"
    @mouseleave="hover = false"
    class="list-group-item assessment-item">
    <span v-if="exam" class="drag-handle">
      <span class="mdi mdi-drag-vertical"></span>
    </span>
    <te-assessment
      v-if="expanded"
      :element="assessment"
      :exam="exam"
      :summative="true"
      @selected="$emit('selected')"
      @delete="$emit('delete')"
      @save="save">
      <div class="label assessment-type pull-left">{{ elementConfig.name }}</div>
      <span @click="$emit('selected')" class="btn btn-link pull-right">Collapse</span>
      <div v-if="exam && examObjectives.length" class="select-leaf">
        <multiselect
          :value="objective"
          :options="examObjectives"
          :searchable="true"
          :disabled="!examObjectives.length"
          :trackBy="'id'"
          :customLabel="it => it.data ? it.data.name : ''"
          :placeholder="examObjectiveLabel"
          @input="onObjectiveSelected"/>
      </div>
    </te-assessment>
    <div v-else @click="$emit('selected')" class="minimized">
      <span class="label label-success">{{ elementConfig.subtype }}</span>
      <span class="title">{{ question }}</span>
      <span @click.stop="$emit('delete')" class="delete">
        <span class="mdi mdi-close"></span>
      </span>
    </div>
  </li>
</template>

<script>
import { mapGetters } from 'vuex-module';
import cloneDeep from 'lodash/cloneDeep';
import filter from 'lodash/filter';
import find from 'lodash/find';
import get from 'lodash/get';
import { getLevel } from 'shared/activities';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';
import Multiselect from '../../common/Select';
import set from 'lodash/set';
import truncate from 'lodash/truncate';
import uniq from 'lodash/uniq';

const blankRegex = /(@blank)/g;
const htmlRegex = /<\/?[^>]+(>|$)/g;

export default {
  name: 'assessment-item',
  inject: ['$teRegistry'],
  props: {
    assessment: { type: Object, required: true },
    exam: { type: Object, default: null },
    expanded: { type: Boolean, default: false }
  },
  data() {
    return {
      hover: false,
      objective: null
    };
  },
  computed: {
    ...mapGetters(['getExamObjectives'], 'activities'),
    elementConfig() {
      return this.$teRegistry.get(this.assessment.data.type);
    },
    question() {
      let question = filter(this.assessment.data.question, { type: 'HTML' });
      question = map(question, 'data.content').join(' ');
      question = question.replace(htmlRegex, '').replace(blankRegex, () => `____`);
      return truncate(question, { length: 50 });
    },
    examObjectives() {
      return this.getExamObjectives(this.exam);
    },
    examObjectiveLabel() {
      if (isEmpty(this.examObjectives)) return '';
      const types = uniq(map(this.examObjectives, 'type'));
      const label = types.length > 1 ? 'Objective' : getLevel(types[0]).label;
      return `Link ${label}`;
    }
  },
  methods: {
    save(data) {
      const assessment = cloneDeep(this.assessment);
      Object.assign(assessment.data, data);
      this.$emit('save', assessment);
    },
    onObjectiveSelected(objective) {
      this.objective = objective;
      const assessment = cloneDeep(this.assessment);
      set(assessment, 'refs.objectiveId', this.objective.id);
      this.$emit('save', assessment);
    }
  },
  mounted() {
    const objectiveId = get(this.assessment, 'refs.objectiveId');
    if (!objectiveId) return;
    this.objective = find(this.examObjectives, { id: objectiveId });
  },
  components: { Multiselect }
};
</script>

<style lang="scss" scoped>
.assessment-item {
  margin-bottom: 7px;
  padding: 0;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.14);

  &, &:first-child, &:last-child {
    border-radius: 0;
  }

  .drag-handle {
    position: absolute;
    top: 0;
    left: -3px;
    color: #888;
    font-size: 28px;
    opacity: 0;
    cursor: move;
  }

  &.hover .drag-handle {
    opacity: 1;
    transition: opacity 0.6s ease-in-out;
  }

  .minimized {
    padding: 12px 22px;
    &:hover { cursor: pointer; }
  }

  .title {
    display: inline-block;
    height: 19px;
    max-width: 80%;
  }

  .label {
    float: left;
    min-width: 30px;
    padding: 3px 5px;
    font-size: 11px;
  }

  .delete {
    display: inline-block;
    position: absolute;
    right: 15px;
    color: #707070;
    font-size: 18px;
    line-height: 18px;
    visibility: hidden;

    &:hover { color: #555; }
  }

  &.hover:not(.sortable-chosen) .delete {
    visibility: visible;
  }
}

.select-leaf {
  clear: both;

  > div {
    width: 400px;
    float: right;
  }
}
</style>
