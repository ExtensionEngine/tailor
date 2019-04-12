<template>
  <div class="assessments">
    <div class="heading">
      <h2>Assessments</h2>
      <span v-if="hasAssessments" @click="toggleAssessments">
        {{ allSelected ? 'hide all' : 'show all' }}
      </span>
    </div>
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
        @delete="it.id ? requestDeleteConfirmation(it) : remove(it)"/>
    </ul>
    <add-element
      :include="['ASSESSMENT']"
      :activity="activity"
      @add="addAssessment"/>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex-module';
import AddElement from 'tce-core/AddElement';
import AssessmentItem from './AssessmentItem';
import EventBus from 'EventBus';
import map from 'lodash/map';

const appChannel = EventBus.channel('app');

export default {
  name: 'assessments',
  data() {
    return {
      selected: [],
      allSelected: false
    };
  },
  computed: {
    ...mapGetters(['activity', 'assessments'], 'editor'),
    hasAssessments() {
      return this.assessments.length;
    }
  },
  methods: {
    ...mapActions(['save', 'update', 'remove'], 'tes'),
    ...mapMutations(['add'], 'tes'),
    addAssessment(assessment) {
      this.add(assessment);
      this.selected.push(assessment._cid);
    },
    saveAssessment(assessment) {
      // TODO: Figure out why save is broken (for update)
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
    toggleAssessments() {
      this.allSelected = !this.allSelected;
      this.selected = this.allSelected ? map(this.assessments, it => it._cid) : [];
    },
    requestDeleteConfirmation(assessment) {
      appChannel.emit('showConfirmationModal', {
        title: 'Delete assessment?',
        message: 'Are you sure you want to delete assessment?',
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
.assessments {
  margin: 70px 0 250px;

  .well {
    font-size: 16px;
  }

  .heading {
    text-align: left;

    span {
      float: right;
      margin-top: 12px;
      cursor: pointer;
    }
  }

  h2 {
    display: inline-block;
    margin: 10px 0 15px;
    padding: 0;
    color: #444;
    font-size: 18px;
  }
}
</style>
