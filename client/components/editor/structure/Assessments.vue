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
    <v-expansion-panels v-model="selected" multiple>
      <assessment-item
        v-for="it in assessments"
        :key="it._cid"
        @save="saveAssessment"
        @delete="requestRemoveConfirmation(it)"
        :assessment="it" />
    </v-expansion-panels>
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
      selected: []
    };
  },
  computed: {
    ...mapGetters('editor', ['activity', 'assessments']),
    hasAssessments() {
      return this.assessments.length;
    },
    allSelected() {
      return this.assessments.length === this.selected.length;
    }
  },
  methods: {
    ...mapActions('tes', ['save', 'update', 'remove']),
    ...mapMutations('tes', ['add']),
    addAssessment(assessment) {
      this.add(assessment);
    },
    saveAssessment(assessment) {
      // TODO: Figure out why save is broken (for update)
      return assessment.id ? this.update(assessment) : this.save(assessment);
    },
    toggleAssessments() {
      this.selected = !this.allSelected ? map(this.assessments, (it, i) => i) : [];
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
    }
  }

  h2 {
    display: inline-block;
    margin: 0;
    font-size: 18px;
    font-weight: $font-weight-medium;
    line-height: 30px;
    vertical-align: middle;
  }
}
</style>
