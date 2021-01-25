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
import filter from 'lodash/filter';
import isAfter from 'date-fns/isAfter';
import map from 'lodash/map';
import mapValues from 'lodash/mapValues';
import merge from 'lodash/merge';
import omit from 'lodash/omit';
import produce from 'immer';
import reduce from 'lodash/reduce';
import revisionApi from '@/api/revision';

const getPublishedState = revisions => revisions.reduce((all, { state }) => ({
  ...all,
  [state.uid]: omit(state, ['createdAt', 'updatedAt'])
}), {});

const pureMerge = (source, target) => produce(source, draft => merge(draft, target));

export default {
  name: 'publish-diff-provider',
  props: {
    activityId: { type: Number, required: true },
    repositoryId: { type: Number, required: true },
    elements: { type: Object, default: () => ({}) },
    activities: { type: Object, default: () => ({}) },
    containerGroups: { type: Object, default: () => ({}) },
    publishTimestamp: { type: String, default: null },
    showDiff: { type: Boolean, default: false }
  },
  data: () => ({ publishedElements: {}, publishedActivities: {} }),
  computed: {
    processedElements() {
      const elements = pureMerge(this.elements, this.publishedElements);
      return mapValues(elements, this.addChangeType);
    },
    processedActivities() {
      return pureMerge(this.activities, this.publishedActivities);
    },
    processedContainerGroups() {
      return reduce(this.containerGroups, this.addPublishedContainersToGroup, {});
    }
  },
  methods: {
    isAdded(element) {
      if (!this.publishTimestamp) return true;
      const createdAt = new Date(element.createdAt);
      const publishedAt = new Date(this.publishTimestamp);
      return isAfter(createdAt, publishedAt);
    },
    isModified(element) {
      if (!this.publishTimestamp) return false;
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
    addChangeType(element) {
      return { ...element, changeSincePublish: this.getChangeType(element) };
    },
    addPublishedContainersToGroup(groups, group, type) {
      const publishedContainers = filter(this.publishedActivities, {
        type,
        parentId: this.activityId
      });
      return {
        ...groups,
        [type]: [...group, ...publishedContainers]
      };
    },
    fetchPublishedState() {
      const query = {
        elementIds: map(this.elements, 'id'),
        activityId: this.activityId,
        timestamp: this.publishTimestamp
      };
      return revisionApi.getStateAtMoment(this.repositoryId, query)
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
