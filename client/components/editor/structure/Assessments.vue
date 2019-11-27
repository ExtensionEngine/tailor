<template>
  <div class="assessments">
    <div class="heading">
      <h2 class="blue-grey--text text--darken-3">Assessments</h2>
      <v-btn v-if="hasAssessments" @click="toggleAssessments" text small>
        {{ allSelected ? 'hide all' : 'show all' }}
      </v-btn>
    </div>
    <v-alert :value="!hasAssessments" color="white" icon="mdi-information-variant">
      Click the button below to create first assessment.
    </v-alert>
    <ul class="list-group">
      <assessment-item
        v-for="it in assessments"
        :key="it._cid"
        @selected="toggleSelect(it)"
        @save="saveAssessment"
        @delete="requestRemoveConfirmation(it)"
        :assessment="it"
        :expanded="isSelected(it)" />
    </ul>
    <add-element
      @add="addAssessment"
      :include="['ASSESSMENT']"
      :activity="activity"
      :layout="false"
      large
      label="Add assessment" />
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex';
import AddElement from 'tce-core/AddElement';
import AssessmentItem from './AssessmentItem';
import capitalize from 'lodash/capitalize';
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
    ...mapGetters('editor', ['activity', 'assessments']),
    hasAssessments() {
      return this.assessments.length;
    }
  },
  methods: {
    ...mapActions('tes', ['save', 'update', 'remove']),
    ...mapMutations('tes', ['add']),
    addAssessment(assessment) {
      this.add(assessment);
      this.selected.push(assessment._cid);
    },
    saveAssessment(assessment) {
      // TODO: Figure out why save is broken (for update)
      return assessment.id ? this.update(assessment) : this.save(assessment);
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
    requestRemoveConfirmation(assessment) {
      const actionPrefix = assessment.id ? 'delete' : 'discard';
      const title = capitalize(`${actionPrefix} assessment?`);
      const message = `Are you sure you want to ${actionPrefix} assessment?`;
      const action = () => this.remove(assessment);
      appChannel.emit('showConfirmationModal', { title, message, action });
    }
  },
  components: { AddElement, AssessmentItem }
};
</script>

<style lang="scss" scoped>
.assessments {
  margin: 70px 0 250px;

  .v-alert {
    color: #555;
  }

  .heading {
    text-align: left;
    padding: 0 0 8px 2px;

    .v-btn {
      float: right;
      margin: 4px 0 0;
      padding: 0;
    }
  }

  h2 {
    display: inline-block;
    margin: 0;
    font-size: 18px;
    line-height: 30px;
    vertical-align: middle;
  }
}
</style>
