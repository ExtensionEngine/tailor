<template>
  <div :class="{ collapsed }" class="exam">
    <div v-if="collapsed" @click="collapsed = false">
      <h3>{{ title }}</h3>
      <span class="label label-success pull-right">{{ label }}</span>
    </div>
    <div v-else>
      <div class="header">
        <h3 class="pull-left">{{ title }}</h3>
        <div class="actions">
          <span
            @click="requestDeletion(container)"
            class="btn btn-sm btn-link pull-right">
            Delete
          </span>
          <span
            @click="collapsed = true"
            class="btn btn-sm btn-link pull-right">
            Collapse
          </span>
        </div>
      </div>
      <div v-if="!groups.length" class="well">
        Click the button below to Create first question group.
      </div>
      <assessment-group
        v-for="(group, index) in groups"
        :key="group._cid"
        :group="group"
        :examObjectives="examObjectives"
        :position="index"/>
      <v-btn
        :disabled="!container.id"
        @click.stop="createGroup"
        color="primary"
        outline
        class="my-5">
        <v-icon class="pr-2">mdi-file-tree</v-icon>
        Add Question Group
      </v-btn>
    </div>
  </div>
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
    container: { type: Object, required: true },
    position: { type: Number, required: true },
    config: { type: Object, default: () => ({}) }
  },
  data() {
    let collapsed = this.container.id;
    return {
      collapsed
    };
  },
  computed: {
    ...mapGetters('activities', ['getExamObjectives']),
    ...mapGetters(['activities']),
    groups() {
      return filter(this.activities, { parentId: this.container.id });
    },
    title() {
      return `Exam ${numberToLetter(this.position)}`;
    },
    label() {
      const groupTotal = this.groups.length;
      return `${groupTotal} ${pluralize('set', groupTotal)}`;
    },
    examObjectives() {
      return this.getExamObjectives(this.container, this.config);
    }
  },
  methods: {
    ...mapActions('activities', ['save', 'remove']),
    ...mapActions('tes', { getTeachingElements: 'fetch' }),
    createGroup() {
      this.save({
        type: 'ASSESSMENT_GROUP',
        parentId: this.container.id,
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
    this.getTeachingElements({ parentId: this.container.id });
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
  text-align: left;
}

.exam {
  margin-bottom: 13px;
  padding: 0;
  background-color: #ffffff;
  box-shadow: 0 1px 4px rgba(0,0,0,0.3);

  > div {
    padding: 15px 25px;
  }

  .header {
    min-height: 50px;
    padding: 5px;
  }
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
</style>
