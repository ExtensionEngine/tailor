<template>
  <li :class="{ collapsed }" class="list-group-item exam">
    <div v-if="collapsed" @click="collapsed = false">
      <h3>{{ title }}</h3>
      <span class="label label-success pull-right">{{ label }}</span>
    </div>
    <div v-else>
      <h3 class="pull-left">{{ title }}</h3>
      <div class="actions">
        <span @click="remove(exam)" class="btn btn-sm btn-link pull-right">
          Delete
        </span>
        <span @click="collapsed = true" class="btn btn-sm btn-link pull-right">
          Collapse
        </span>
      </div>
      <div v-if="!groups.length" class="well">
        Click the button below to Create first question group.
      </div>
      <assessment-group
        v-for="(group, index) in groups"
        :key="group._cid"
        :group="group"
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
import filter from 'lodash/filter';
import { mapActions, mapGetters } from 'vuex-module';
import numberToLetter from 'utils/numberToLetter';
import pluralize from 'pluralize';

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
    createGroup() {
      this.save({
        type: 'ASSESSMENT_GROUP',
        parentId: this.exam.id,
        position: this.groups.length + 1
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
