<template>
  <div :class="{ collapsed }" class="exam">
    <div
      v-if="collapsed"
      @click="collapsed = false"
      class="d-flex justify-center align-center">
      <h3 class="ml-auto">{{ title }}</h3>
      <v-chip
        color="green"
        text-color="white"
        label small
        class="ml-auto">
        <strong>{{ label }}</strong>
      </v-chip>
    </div>
    <div v-else>
      <div class="header d-flex justify-space-between align-baseline">
        <h3 class="text-left">{{ title }}</h3>
        <div class="actions">
          <v-btn @click="collapsed = true" text>
            Collapse
          </v-btn>
          <v-btn @click="$emit('delete')" text>
            Delete
          </v-btn>
        </div>
      </div>
      <v-alert
        v-if="!groups.length"
        color="blue-grey darken-3"
        icon="mdi-information-variant"
        text>
        Click the button below to Create first question group.
      </v-alert>
      <assessment-group
        v-for="(group, index) in groups"
        :key="group.uid"
        @save:element="$emit('save:element', $event)"
        @update:element="$emit('update:element', $event)"
        @reorder:element="$emit('reorder:element', $event)"
        @delete:element="$emit('delete:element', $event)"
        @update="$emit('update:subcontainer', $event)"
        @delete="$emit('delete:subcontainer', group, 'group')"
        :group="group"
        :elements="elements"
        :objectives="examObjectives"
        :position="index" />
      <v-btn
        @click.stop="createGroup"
        :disabled="!container.id"
        color="primary darken-2"
        outlined
        class="my-5">
        <v-icon class="pr-2">mdi-file-tree</v-icon>
        Add Question Group
      </v-btn>
    </div>
  </div>
</template>

<script>
import { activity as activityUtils, numberToLetter } from '@tailor-cms/utils';
import AssessmentGroup from './AssessmentGroup.vue';
import filter from 'lodash/filter';
import find from 'lodash/find';
import get from 'lodash/get';
import pluralize from 'pluralize';

const { getDescendants } = activityUtils;

export default {
  name: 'exam',
  props: {
    container: { type: Object, required: true },
    position: { type: Number, required: true },
    activities: { type: Object, required: true },
    elements: { type: Object, required: true },
    config: { type: Object, default: () => ({}) }
  },
  data() {
    return { collapsed: this.container.id };
  },
  computed: {
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
      const { container, config, activities } = this;
      const activity = find(activities, { id: container.parentId });
      const objectiveTypes = get(config, 'objectives');
      if (!objectiveTypes) return [];
      const children = getDescendants(activities, activity);
      return filter(children, it => objectiveTypes.includes(it.type));
    }
  },
  methods: {
    createGroup() {
      this.$emit('add:subcontainer', {
        type: 'ASSESSMENT_GROUP',
        parentId: this.container.id,
        position: this.groups.length + 1
      });
    }
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
  background-color: #fff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);

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
