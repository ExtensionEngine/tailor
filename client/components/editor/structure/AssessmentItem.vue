<template>
  <li
    @mouseenter="hover = true"
    @mouseleave="hover = false"
    :class="{ hover }"
    class="list-group-item assessment-item elevation-1">
    <span v-if="exam" class="drag-handle">
      <span class="mdi mdi-drag-vertical"></span>
    </span>
    <tce-question-container
      v-if="expanded"
      @selected="$emit('selected')"
      @delete="$emit('delete')"
      @save="save"
      :element="assessment"
      :exam="exam"
      :summative="true">
      <div class="header">
        <v-chip
          color="blue-grey darken-1"
          label
          dark
          small
          class="pull-left text-uppercase">
          {{ elementConfig.name }}
        </v-chip>
        <v-btn
          @click="$emit('selected')"
          text
          small
          class="pull-right collapse-item">
          Collapse
        </v-btn>
        <div v-if="exam && examObjectives.length" class="select-leaf">
          <multiselect
            @input="onObjectiveSelected"
            :value="objective"
            :options="examObjectives"
            :searchable="true"
            :disabled="!examObjectives.length"
            :track-by="'id'"
            :custom-label="it => it.data ? it.data.name : ''"
            :placeholder="examObjectiveLabel" />
        </div>
      </div>
    </tce-question-container>
    <div v-else @click="$emit('selected')" class="minimized">
      <v-chip color="blue-grey darken-1" label dark small>
        {{ elementConfig.subtype }}
      </v-chip>
      <span class="question">{{ question | truncate(50) }}</span>
      <v-btn
        @click.stop="$emit('delete')"
        color="primary"
        text
        icon
        class="delete">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </div>
  </li>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep';
import filter from 'lodash/filter';
import find from 'lodash/find';
import get from 'lodash/get';
import { getLevel } from 'shared/activities';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';
import { mapGetters } from 'vuex';
import Multiselect from '../../common/Select';
import set from 'lodash/set';
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
    ...mapGetters('activities', ['getExamObjectives']),
    elementConfig() {
      return this.$teRegistry.get(this.assessment.data.type);
    },
    question() {
      let question = filter(this.assessment.data.question, { type: 'HTML' });
      question = map(question, 'data.content').join(' ');
      return question.replace(htmlRegex, '').replace(blankRegex, () => '____');
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
  margin-bottom: 10px;
  padding: 0;

  .v-chip {
    float: left;
    min-width: 30px;
    margin: 0;
  }

  .header {
    padding-bottom: 40px;

    .collapse-item {
      margin: 0;
      padding: 0;
    }
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
    padding: 5px 22px;
    cursor: pointer;

    .question {
      display: inline-block;
      max-width: 80%;
      min-height: 30px;
      color: #444;
      font-size: 16px;
      font-weight: 400;
      line-height: 34px;
    }

    .v-chip {
      margin-top: 5px;
    }
  }

  .delete {
    display: inline-block;
    position: absolute;
    top: 0;
    right: 0;
    opacity: 0;
  }

  &.hover:not(.sortable-chosen) .delete {
    opacity: 1;
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
