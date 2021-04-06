<template>
  <div>
    <template v-if="!isLoading">
      <toolbar
        :element="selectedElement"
        :active-users="activeUsers" />
      <div class="editor-content-container">
        <sidebar
          :repository="repository"
          :activities="outlineActivities"
          :selected-activity="activity"
          :selected-element="selectedElement"
          class="sidebar" />
        <activity-content
          :key="activity.id"
          @selected="selectElement"
          :repository="repository"
          :activity="activity"
          :root-container-groups="rootContainerGroups"
          :content-containers="contentContainers"
          class="activity-content" />
      </div>
    </template>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex';
import ActivityContent from './ActivityContent';
import get from 'lodash/get';
import { getElementId } from '@tailor/utils';
import Sidebar from './Sidebar';
import Toolbar from './Toolbar';
import withUserTracking from 'components/common/mixins/userTracking';

export default {
  name: 'content-editor',
  mixins: [withUserTracking],
  props: {
    repositoryId: { type: Number, required: true },
    activityId: { type: Number, required: true }
  },
  data: () => ({
    isLoading: true,
    selectedElement: null
  }),
  computed: {
    ...mapGetters('editor', ['activity', 'contentContainers', 'rootContainerGroups']),
    ...mapGetters('repository', ['repository', 'activities', 'outlineActivities']),
    ...mapGetters('repository/userTracking', ['getActiveUsers']),
    ...mapState('editor', ['showPublishDiff']),
    activeUsers: vm => vm.getActiveUsers('activity', vm.activityId)
  },
  methods: {
    ...mapMutations('editor', ['togglePublishDiff']),
    ...mapActions('repository', ['initialize']),
    closePublishDiff() {
      this.togglePublishDiff(false);
    },
    selectElement(element) {
      this.selectedElement = element;
      const selectedElementId = getElementId(element);
      const { elementId: queryElementId, ...query } = this.$route.query;
      if (selectedElementId === queryElementId) return;
      if (selectedElementId) query.elementId = selectedElementId;
      this.$router.replace({ query });
    }
  },
  provide() {
    const $editorState = {};
    const $editorContent = {};
    Object.defineProperties($editorState, {
      isPublishDiff: {
        get: () => this.showPublishDiff,
        enumerable: true
      }
    });
    Object.defineProperties($editorContent, {
      repository: {
        get: () => this.repository,
        enumerable: true
      },
      activities: {
        get: () => this.activities,
        enumerable: true
      }
    });
    return { $editorContent, $editorState };
  },
  watch: {
    activityId() {
      this.selectedElement = null;
      this.closePublishDiff();
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
    this.closePublishDiff();
  },
  components: {
    ActivityContent,
    Sidebar,
    Toolbar
  }
};
</script>

<style lang="scss" scoped>
$sidebar-width: 25rem;

.editor-content-container {
  display: flex;
  height: calc(100% - 3.5rem);

  .sidebar {
    flex-basis: $sidebar-width;
  }

  .activity-content {
    flex-grow: 1;
    flex-basis: calc(100% - #{$sidebar-width});
  }
}
</style>
