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
        :elements="elementsOrRevisions"
        :revisions="revisions"
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
    revisions: {}
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
      return mapValues(elements, it => ({
        ...it,
        isModified: this.isElementModified(it)
      }));
    },
    elementsOrRevisions() {
      if (!this.isPublishedPreview) return this.activityElements;
      const elements = cloneDeep(this.activityElements);
      return assignWith(elements, this.revisions, this.mergeElementWithRevision);
    }
  },
  methods: {
    ...mapMutations('editor', ['setIsPublishedPreview']),
    ...mapActions('repository', ['initialize']),
    mergeElementWithRevision(element, revision) {
      if (!revision) return element;
      return {
        ...element,
        ...revision.state,
        isRemoved: !element
      };
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
        publishedOn: this.activity.publishedAt,
        last: true
      };
      return revisionApi.fetch(this.repository.id, query)
        .then(this.setRevisions);
    },
    setRevisions(revisions) {
      this.revisions = revisions.reduce((all, it) => ({
        ...all,
        [it.state.uid]: it
      }), {});
    },
    isActivityElement(element) {
      return this.containerIds.some(id => id === element.activityId);
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
