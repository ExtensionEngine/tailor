<template>
  <div class="editor-container">
    <template v-if="!isLoading">
      <toolbar :element="selectedElement" :active-users="activeUsers" />
      <sidebar
        :repository="repository"
        :activities="outlineActivities"
        :selected-activity="activity"
        :selected-element="selectedElement" />
      <activity-content
        :key="activity.id"
        @selected="selectedElement = $event"
        :repository="repository"
        :activity="activity"
        :elements="isPublishedPreview ? changesSincePublish : activityElements"
        :root-container-groups="rootContainerGroups"
        :content-containers="contentContainers" />
    </template>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex';
import ActivityContent from './ActivityContent';
import assignWith from 'lodash/assignWith';
import cloneDeep from 'lodash/cloneDeep';
import filter from 'lodash/filter';
import get from 'lodash/get';
import isAfter from 'date-fns/isAfter';
import map from 'lodash/map';
import { mapChannels } from '@/plugins/radio';
import mapValues from 'lodash/mapValues';
import pickBy from 'lodash/pickBy';
import revisionApi from '@/api/revision';
import Sidebar from './Sidebar';
import Toolbar from './Toolbar';
import withUserTracking from 'components/common/mixins/userTracking';

const CE_FOCUS_EVENT = 'element:focus';

export default {
  name: 'content-editor',
  mixins: [withUserTracking],
  props: {
    repositoryId: { type: Number, required: true },
    activityId: { type: Number, required: true }
  },
  data: () => ({
    isLoading: true,
    selectedElement: null,
    publishedRevisions: {}
  }),
  computed: {
    ...mapState('editor', ['isPublishedPreview']),
    ...mapGetters('repository/userTracking', ['getActiveUsers']),
    ...mapGetters('repository', ['repository', 'outlineActivities']),
    ...mapGetters('editor', ['activity', 'contentContainers', 'rootContainerGroups']),
    ...mapGetters('repository/contentElements', ['elements']),
    ...mapChannels({ editorChannel: 'editor' }),
    activeUsers: vm => vm.getActiveUsers('activity', vm.activityId),
    containerIds: vm => vm.contentContainers.map(it => it.id),
    activityElements() {
      const elements = pickBy(this.elements, this.isActivityElement);
      return mapValues(elements, this.addPublishFlags);
    },
    changesSincePublish() {
      const elements = cloneDeep(this.activityElements);
      return this.unionElementsAndRevisions(elements, this.publishedRevisions);
    }
  },
  methods: {
    ...mapMutations('editor', ['setIsPublishedPreview']),
    ...mapActions('repository', ['initialize']),
    unionElementsAndRevisions(elements, revisions) {
      return assignWith(elements, revisions, (element, revision) => ({
        ...element,
        ...revision,
        isRemoved: !element,
        isPublished: !element || element.isPublished
      }));
    },
    resetPublishedPreview() {
      if (this.isPublishedPreview) this.setIsPublishedPreview(false);
    },
    fetchRevisions() {
      const modifiedActivityElements = filter(this.activityElements, 'isModified');
      const query = {
        activityIds: this.containerIds,
        entityIds: map(modifiedActivityElements, 'id'),
        entity: 'CONTENT_ELEMENT',
        publishedOn: this.activity.publishedAt
      };
      return revisionApi.fetch(this.repository.id, query)
        .then(revisions => {
          this.publishedRevisions = this.normalizeRevisions(revisions);
        });
    },
    normalizeRevisions(revisions) {
      return revisions.reduce((all, { state }) => ({
        ...all,
        [state.uid]: state
      }), {});
    },
    addPublishFlags(element) {
      const isPublished = this.isElementPublished(element);
      const isModified = isPublished && this.isElementModified(element);
      return { ...element, isPublished, isModified };
    },
    isActivityElement(element) {
      return this.containerIds.some(id => id === element.activityId);
    },
    isElementPublished(element) {
      const createdAt = new Date(element.createdAt);
      const publishedAt = new Date(this.activity.publishedAt);
      return isAfter(publishedAt, createdAt);
    },
    isElementModified(element) {
      const updatedAt = new Date(element.updatedAt);
      const publishedAt = new Date(this.activity.publishedAt);
      return isAfter(updatedAt, publishedAt);
    }
  },
  watch: {
    activityId: 'resetPublishedPreview',
    isPublishedPreview(isOn) {
      if (!isOn) return;
      this.editorChannel.emit(CE_FOCUS_EVENT);
      this.fetchRevisions();
    }
  },
  async created() {
    const { repositoryId: currentRepositoryId, repository: storeRepository } = this;
    const repositoryLoaded = !!storeRepository;
    const repositoryChanged = get(storeRepository, 'id') !== currentRepositoryId;
    if (!repositoryLoaded || repositoryChanged) {
      await this.initialize(currentRepositoryId);
    }
    this.isLoading = false;
  },
  beforeDestroy() {
    this.resetPublishedPreview();
  },
  components: {
    ActivityContent,
    Sidebar,
    Toolbar
  }
};
</script>

<style lang="scss" scoped>
.editor-container {
  display: flex;
  flex-direction: column;
}
</style>
