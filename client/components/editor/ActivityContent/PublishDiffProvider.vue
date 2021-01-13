<template>
  <div>
    <slot
      v-if="showDiff"
      v-bind="{ processedElements, processedContainerGroups, processedActivities }">
    </slot>
    <slot
      v-else
      :processed-elements="elements"
      :processed-container-groups="containerGroups"
      :processed-activities="activities">
    </slot>
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep';
import filter from 'lodash/filter';
import isAfter from 'date-fns/isAfter';
import map from 'lodash/map';
import mapValues from 'lodash/mapValues';
import merge from 'lodash/merge';
import omit from 'lodash/omit';
import reduce from 'lodash/reduce';
import revisionApi from '@/api/revision';

const getPublishedState = revisions => revisions.reduce((all, { state }) => ({
  ...all,
  [state.uid]: omit(state, ['createdAt', 'updatedAt'])
}), {});

export default {
  name: 'publish-diff-provider',
  props: {
    showDiff: { type: Boolean, default: false },
    publishTimestamp: { type: String, required: true },
    elements: { type: Object, default: () => ({}) },
    activities: { type: Object, default: () => ({}) },
    containerGroups: { type: Object, default: () => ({}) },
    activityId: { type: Number, required: true },
    repositoryId: { type: Number, required: true }
  },
  data: () => ({
    publishedElements: {},
    publishedActivities: {}
  }),
  computed: {
    processedElements() {
      const elements = cloneDeep(this.elements);
      return mapValues(merge(elements, this.publishedElements), element => ({
        ...element,
        changeSincePublish: this.getChangeType(element)
      }));
    },
    processedActivities() {
      const activities = cloneDeep(this.activities);
      return merge(activities, this.publishedActivities);
    },
    processedContainerGroups() {
      return reduce(this.containerGroups, (groups, group, type) => {
        const containers = filter(this.publishedActivities, {
          type,
          parentId: this.activityId
        });
        return { ...groups, [type]: [...group, ...containers] };
      }, {});
    }
  },
  methods: {
    isAdded(element) {
      const createdAt = new Date(element.createdAt);
      const publishedAt = new Date(this.publishTimestamp);
      return isAfter(createdAt, publishedAt);
    },
    isModified(element) {
      const updatedAt = new Date(element.updatedAt);
      const publishedAt = new Date(this.publishTimestamp);
      return isAfter(updatedAt, publishedAt);
    },
    isRemoved(element) {
      return !this.elements[element.uid];
    },
    getChangeType(element) {
      if (this.isAdded(element)) return 'new';
      if (this.isRemoved(element)) return 'removed';
      if (this.isModified(element)) return 'changed';
      return null;
    },
    fetchPublishedState() {
      const query = {
        elementIds: map(this.elements, 'id'),
        activityId: this.activityId,
        timestamp: this.publishTimestamp
      };
      return revisionApi.getStateByMoment(this.repositoryId, query)
        .then(({ activities, elements }) => {
          this.publishedElements = getPublishedState(elements);
          this.publishedActivities = getPublishedState(activities);
        });
    }
  },
  watch: {
    showDiff(isOn) {
      if (isOn) this.fetchPublishedState();
    }
  }
};
</script>
