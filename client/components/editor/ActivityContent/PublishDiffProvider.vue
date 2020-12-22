<template>
  <div>
    <slot :processed-elements="showDiff ? elementsWithPublishDiff : elements"></slot>
  </div>
</template>

<script>
import isAfter from 'date-fns/isAfter';
import map from 'lodash/map';
import mapValues from 'lodash/mapValues';
import merge from 'lodash/merge';
import omit from 'lodash/omit';
import revisionApi from '@/api/revision';

function getPublishedState(revisions) {
  return revisions.reduce((all, { state }) => ({
    ...all,
    [state.uid]: omit(state, ['createdAt', 'updatedAt'])
  }), {});
}

export default {
  name: 'publish-diff-provider',
  props: {
    showDiff: { type: Boolean, default: false },
    publishTimestamp: { type: String, required: true },
    elements: { type: Object, default: () => ({}) },
    containerIds: { type: Array, default: () => [] },
    repositoryId: { type: Number, required: true }
  },
  data: () => ({ publishedElements: {} }),
  computed: {
    elementsWithPublishDiff() {
      const { elements, publishedElements } = this;
      return mapValues(merge(elements, publishedElements), element => ({
        ...element,
        changeSincePublish: this.getChangeType(element)
      }));
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
      if (this.isAdded(element)) return 'added';
      if (this.isRemoved(element)) return 'removed';
      if (this.isModified(element)) return 'changed';
      return null;
    },
    fetchPublishedElements() {
      const query = {
        entity: 'CONTENT_ELEMENT',
        entityIds: map(this.elements, 'id'),
        activityIds: this.containerIds,
        publishedOn: this.publishTimestamp
      };
      return revisionApi.fetch(this.repositoryId, query)
        .then(revisions => {
          this.publishedElements = getPublishedState(revisions);
        });
    }
  },
  watch: {
    showDiff(isOn) {
      if (isOn) this.fetchPublishedElements();
    }
  }
};
</script>
