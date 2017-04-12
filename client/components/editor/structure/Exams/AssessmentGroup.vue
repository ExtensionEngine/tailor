<template>
  <div class="assessment-group">
    <span @click="removeGroup(group)" class="remove">
      <span class="mdi mdi-delete"></span>
    </span>
    <h3>Question group</h3>
    <div v-if="!hasAssessments" class="well">
      Click the button below to Create first Assessment.
    </div>
    <ul class="list-group">
      <assessment-item
        v-for="it in assessments"
        :key="it._cid"
        :assessment="it"
        :expanded="isSelected(it)"
        @selected="toggleSelect(it)"
        @save="saveAssessment"
        @remove="it.id ? requestDeleteConfirmation(it) : remove(it)">
      </assessment-item>
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
import EventBus from 'EventBus';
import filter from 'lodash/filter';
import { mapActions, mapGetters, mapMutations } from 'vuex-module';

const appChannel = EventBus.channel('app');

export default {
  name: 'assessments',
  props: ['group'],
  data() {
    return {
      selected: []
    };
  },
  computed: {
    ...mapGetters(['tes']),
    assessments() {
      return filter(this.tes, { activityId: this.group.id });
    },
    hasAssessments() {
      return this.assessments && !!this.assessments.length;
    }
  },
  methods: {
    ...mapMutations(['add'], 'tes'),
    ...mapActions(['save', 'update', 'remove'], 'tes'),
    ...mapActions({ removeGroup: 'remove' }, 'activities'),
    addAssessment(assessment) {
      this.add(assessment);
      this.selected.push(assessment._cid);
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
    requestDeleteConfirmation(assessment) {
      appChannel.emit('showConfirmationModal', {
        type: 'assessment',
        item: assessment,
        action: () => this.remove(assessment)
      });
    }
  },
  components: {
    AddElement,
    AssessmentItem
  }
};
</script>

<style lang="scss" scoped>
h3 {
  margin: 20px 5px;
  color: #444;
  font-size: 18px;
  text-align: left;
}

.assessment-group {
  margin: 30px 0;
  padding: 15px 20px;
  border-radius: 4px;
  background-color: #f1f1f1;

  .well {
    font-size: 16px;
  }
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
</style>
