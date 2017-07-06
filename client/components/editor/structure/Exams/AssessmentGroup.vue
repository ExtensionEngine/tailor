<template>
  <div class="assessment-group">
    <div :class="{ 'divider': position }"></div>
    <span @click="requestDeletion(group)" class="remove">
      <span class="mdi mdi-delete"></span>
    </span>
    <div class="form-inline pull-right">
      <div class="form-group time-limit">
        <label for="timeLimit">Time limit (minutes)</label>
        <input
          v-model="timeLimit"
          id="timeLimit"
          class="form-control"
          type="number"
          step="15">
      </div>
    </div>
    <h3>Question group {{ toLetter(position) }}</h3>
    <h4>Introduction</h4>
    <group-introduction :group="group"></group-introduction>
    <h4>Questions</h4>
    <div v-if="!hasAssessments" class="well">
      Click the button below to Create first Assessment.
    </div>
    <ul class="list-group">
      <draggable
        :list="assessments"
        :options="dragOptions"
        @update="reorderAssessment"
        class="row">
        <assessment-item
          v-for="it in assessments"
          :key="it._cid"
          :assessment="it"
          :exam="exam"
          :expanded="isSelected(it)"
          @selected="toggleSelect(it)"
          @save="saveAssessment"
          @remove="it.id ? requestDeletion(it) : remove(it)">
        </assessment-item>
      </draggable>
    </ul>
    <add-element
      :include="['ASSESSMENT']"
      :activity="group"
      @add="addAssessment">
    </add-element>
  </div>
</template>

<script>
import AddElement from '../AddElement';
import AssessmentItem from '../AssessmentItem';
import cloneDeep from 'lodash/cloneDeep';
import Draggable from 'vuedraggable';
import debounce from 'lodash/debounce';
import EventBus from 'EventBus';
import filter from 'lodash/filter';
import get from 'lodash/get';
import GroupIntroduction from './GroupIntroduction';
import { mapActions, mapGetters, mapMutations } from 'vuex-module';
import numberToLetter from 'utils/numberToLetter';

const appChannel = EventBus.channel('app');

export default {
  name: 'assessment-group',
  props: ['group', 'exam', 'position'],
  data() {
    return {
      selected: [],
      timeLimit: get(this.group, 'data.timeLimit', 0)
    };
  },
  computed: {
    ...mapGetters(['tes']),
    dragOptions() {
      return { handle: '.drag-handle' };
    },
    assessments() {
      const cond = { activityId: this.group.id, type: 'ASSESSMENT' };
      return filter(this.tes, cond).sort((a, b) => a.position - b.position);
    },
    hasAssessments() {
      return this.assessments && !!this.assessments.length;
    }
  },
  methods: {
    ...mapMutations(['add'], 'tes'),
    ...mapActions(['save', 'update', 'reorder', 'remove'], 'tes'),
    ...mapActions({ updateGroup: 'update', removeGroup: 'remove' }, 'activities'),
    addAssessment(assessment) {
      this.add(assessment);
      this.selected.push(assessment._cid);
    },
    reorderAssessment({ newIndex: newPosition }) {
      const items = this.assessments;
      items.forEach((it, i) => {
        if (it.position) return;
        it.position = i + 1;
        this.update(it);
      });

      const element = items[newPosition];
      const isFirstChild = newPosition === 0;
      const context = { items, newPosition, isFirstChild };
      this.reorder({ element, context });
    },
    saveAssessment(assessment) {
      assessment.id ? this.update(assessment) : this.save(assessment);
    },
    toggleSelect(assessment) {
      const question = assessment.data.question;
      const hasQuestion = question && question.length > 0;
      if (this.isSelected(assessment) && !hasQuestion) {
        this.remove(assessment);
      } else if (this.isSelected(assessment)) {
        this.selected.splice(this.selected.indexOf(assessment._cid), 1);
      } else {
        this.selected.push(assessment._cid);
      }
    },
    isSelected(assessment) {
      return this.selected.includes(assessment._cid);
    },
    toLetter(number) {
      return numberToLetter(number);
    },
    requestDeletion(item) {
      const isGroup = item.type === 'ASSESSMENT_GROUP';
      const action = isGroup ? 'removeGroup' : 'remove';
      appChannel.emit('showConfirmationModal', {
        type: isGroup ? 'group' : 'element',
        item,
        action: () => this[action](item)
      });
    }
  },
  watch: {
    timeLimit: debounce(function (val) {
      let group = cloneDeep(this.group);
      group.data = group.data || {};
      group.data.timeLimit = val;
      this.updateGroup(group);
    }, 1500)
  },
  components: {
    AddElement,
    AssessmentItem,
    Draggable,
    GroupIntroduction
  }
};
</script>

<style lang="scss" scoped>
h3 {
  margin: 30px 5px;
  color: #444;
  font-size: 18px;
  text-align: left;
}

h4 {
  margin: 20px 5px;
  color: #444;
  font-size: 16px;
  text-align: left;
}

.assessment-group {
  margin: 30px 0;
  padding: 15px 20px;

  .well {
    font-size: 16px;
  }
}

.divider {
  margin: 20px 0 70px 0;
  border-top: 1px solid #e1e1e1;
}

.remove {
  float: right;
  margin: 10px 5px;
  color: #777;
  font-size: 22px;

  &:hover {
    color: #444;
    cursor: pointer;
  }
}

.time-limit {
  margin: 7px 20px;

  label {
    margin-right: 5px;
    vertical-align: bottom;
  }

  input {
    width: 50px;
    text-align: center;
  }
}
</style>
