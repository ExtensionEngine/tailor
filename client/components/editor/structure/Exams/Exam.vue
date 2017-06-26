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
        :topics="topics"
        :position="index">
      </assessment-group>
      <button @click="createGroup" class="btn btn-primary create-group">
        <span class="mdi mdi-plus"></span>
        Create Question Group
      </button>
    </div>
  </li>
</template>

<script>
import AssessmentGroup from './AssessmentGroup';
import concat from 'lodash/concat';
import EventBus from 'EventBus';
import filter from 'lodash/filter';
import find from 'lodash/find';
import { mapActions, mapGetters } from 'vuex-module';
import numberToLetter from 'utils/numberToLetter';
import { OUTLINE_LEVELS } from 'shared/activities';
import pluralize from 'pluralize';
import reduce from 'lodash/reduce';

const appChannel = EventBus.channel('app');

export default {
  name: 'exam',
  props: ['exam', 'position'],
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
    topics() {
      const parentActivity = find(this.activities, { id: this.exam.parentId });
      const leafType = OUTLINE_LEVELS[OUTLINE_LEVELS.length - 1].type;

      return this.getLeafs([parentActivity], leafType);
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
    ...mapActions(['save', 'remove'], 'activities'),
    ...mapActions({ getTeachingElements: 'fetch' }, 'tes'),
    getChildren(activity) {
      return filter(this.activities, it => {
        return it.parentId === activity.id && it.type !== 'EXAM';
      });
    },
    getLeafs(activities, leafType) {
      if (!activities || activities.length < 1) return [];
      if (activities[0].type === leafType) return activities;

      const children = reduce(activities, (result, it) => {
        return concat(result, this.getChildren(it));
      }, []);
      return this.getLeafs(children, leafType);
    },
    createGroup() {
      this.save({
        type: 'ASSESSMENT_GROUP',
        parentId: this.exam.id,
        position: this.groups.length + 1
      });
    },
    requestDeletion(item) {
      appChannel.emit('showConfirmationModal', {
        type: 'exam',
        item,
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
  padding: 0;
  margin-bottom: 13px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.30);

  > {
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
  > {
    margin-left: 10px;
  }
}

.label {
  min-width: 40px;
  line-height: 12px;
}

.create-group {
  min-width: 210px;
  margin: 40px 0;
}
</style>
