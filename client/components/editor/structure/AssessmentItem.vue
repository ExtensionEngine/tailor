<template>
  <v-expansion-panel
    class="assessment-item">
    <span v-if="exam" class="drag-handle">
      <span class="mdi mdi-drag-vertical"></span>
    </span>
    <v-expansion-panel-header>
      <template v-slot="{ open }">
        <v-chip
          v-if="open"
          color="primary"
          label
          dark
          small
          class="text-uppercase">
          {{ elementConfig.name }}
        </v-chip>
        <template v-else>
          <v-chip color="primary" label dark small>
            {{ elementConfig.subtype }}
          </v-chip>
          <span class="question">{{ question | truncate(50) }}</span>
        </template>
      </template>
      <template v-slot:actions>
        <v-btn
          @click.stop="$emit('delete')"
          color="primary"
          small
          text
          icon>
          <v-icon small>mdi-close</v-icon>
        </v-btn>
      </template>
    </v-expansion-panel-header>
    <v-expansion-panel-content>
      <v-autocomplete
        v-if="exam && examObjectives.length"
        @input="onObjectiveSelected"
        :value="objective"
        :items="examObjectives"
        item-text="data.name"
        :disabled="!examObjectives.length"
        :placeholder="examObjectiveLabel"
        class="float-right mr-2"
        return-object />
      <tce-question-container
        @delete="$emit('delete')"
        @save="save"
        :element="assessment"
        :exam="exam"
        :summative="true" />
    </v-expansion-panel-content>
  </v-expansion-panel>
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
import set from 'lodash/set';
import uniq from 'lodash/uniq';

const blankRegex = /(@blank)/g;
const htmlRegex = /<\/?[^>]+(>|$)/g;

export default {
  name: 'assessment-item',
  inject: ['$teRegistry'],
  props: {
    assessment: { type: Object, required: true },
    exam: { type: Object, default: null }
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
      return question.replace(htmlRegex, '').replace(blankRegex, () => `____`);
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
  }
};
</script>

<style lang="scss" scoped>
.v-expansion-panel--active .v-expansion-panel-header {
  min-height: 48px;
}

.assessment-item {
  padding: 0;

  .v-chip {
    float: left;
    min-width: 30px;
    margin: 0;
    flex-grow: 0;
  }

  span {
    flex-grow: 0;
  }

  ::v-deep .v-expansion-panel-header {
    justify-content: space-between;
    padding: 8px 24px;

    .v-expansion-panel-header__icon {
      margin-left: 0;
    }
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
    z-index: 2;
    color: #888;
    font-size: 28px;
    opacity: 0;
    cursor: move;
  }

  &:hover .drag-handle {
    opacity: 1;
    transition: opacity 0.6s ease-in-out;
  }

  .question {
    display: inline-block;
    max-width: 80%;
    min-height: 30px;
    color: #444;
    font-size: 16px;
    font-weight: 400;
    line-height: 34px;
  }
}

::v-deep .v-list {
  text-align: left;
}
</style>
