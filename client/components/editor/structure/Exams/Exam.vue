<template>
  <li :class="{ collapsed }" class="list-group-item exam">
    <div v-if="collapsed" @click="collapsed = false">
      <h3>{{ title }}</h3>
      <span class="label label-success pull-right">{{ label }}</span>
    </div>
    <div v-else>
      <div class="header">
        <h3 class="pull-left">{{ title }}</h3>
        <div class="actions">
          <span
            @click="requestDeletion(exam)"
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
    </div>
  </li>
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
    return {
      collapsed: this.exam.id
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
  text-align: left;
}

.exam {
  margin-bottom: 13px;
  padding: 0;
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
