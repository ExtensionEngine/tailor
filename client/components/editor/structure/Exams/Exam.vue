<template>
  <v-expansion-panel>
    <v-expansion-panel-header>
      <h3>{{ title }}</h3>
      <template v-slot:actions>
        <v-chip color="success" label small class="float-right">{{ label }}</v-chip>
        <v-chip
          @click.stop="requestDeletion(exam)"
          small
          label
          outlined
          class="float-right ml-2">
          Delete
        </v-chip>
      </template>
    </v-expansion-panel-header>
    <v-expansion-panel-content>
      <v-alert
        :value="!groups.length"
        color="primary"
        icon="mdi-information-variant"
        outlined>
        Click the button below to Create first question group.
      </v-alert>
      <assessment-group
        v-for="(group, index) in groups"
        :key="group._cid"
        :group="group"
        :exam="exam"
        :position="index" />
      <v-btn
        @click.stop="createGroup"
        :disabled="!exam.id"
        color="primary"
        outlined
        class="my-5">
        <v-icon class="pr-2">mdi-file-tree</v-icon>
        Add Question Group
      </v-btn>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import AssessmentGroup from './AssessmentGroup';
import EventBus from 'EventBus';
import filter from 'lodash/filter';
import numberToLetter from 'utils/numberToLetter';
import pluralize from 'pluralize';

const appChannel = EventBus.channel('app');

export default {
  name: 'exam',
  props: {
    exam: { type: Object, required: true },
    position: { type: Number, required: true }
  },
  data() {
    let collapsed = this.exam.id;
    return {
      collapsed
    };
  },
  computed: {
    ...mapGetters(['activities']),
    groups() {
      return filter(this.activities, { parentId: this.exam.id });
    },
    title() {
      return `Exam ${numberToLetter(this.position)}`;
    },
    label() {
      const groupTotal = this.groups.length;
      return `${groupTotal} ${pluralize('set', groupTotal)}`;
    }
  },
  methods: {
    ...mapActions('activities', ['save', 'remove']),
    ...mapActions('tes', { getTeachingElements: 'fetch' }),
    createGroup() {
      this.save({
        type: 'ASSESSMENT_GROUP',
        parentId: this.exam.id,
        position: this.groups.length + 1
      });
    },
    requestDeletion(item) {
      appChannel.emit('showConfirmationModal', {
        title: 'Delete exam?',
        message: 'Are you sure you want to delete exam?',
        action: () => this.remove(item)
      });
    }
  },
  created() {
    this.getTeachingElements({ parentId: this.exam.id });
  },
  components: {
    AssessmentGroup
  }
};
</script>

<style lang="scss" scoped>
h3 {
  display: inline-block;
  margin: 0;
  padding: 0;
  color: #505050;
  font-size: 14px;
  font-weight: $font-weight-medium;
  text-align: left;
}

.collapsed {
  &:hover {
    background-color: #f0f0f0;
    cursor: pointer;
  }
}

.actions {
  > span {
    margin-left: 10px;
  }
}

.label {
  min-width: 40px;
  line-height: 12px;
}

.v-expansion-panel--active .v-expansion-panel-header {
  min-height: 48px;
}
</style>
