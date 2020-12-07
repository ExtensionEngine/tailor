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
import { mapActions, mapGetters } from 'vuex';
import ActivityContent from './ActivityContent';
import get from 'lodash/get';
import { getElementId } from 'tce-core/utils';
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
    ...mapGetters('repository/userTracking', ['getActiveUsers']),
    ...mapGetters('repository', ['repository', 'outlineActivities']),
    ...mapGetters('editor', ['activity', 'contentContainers', 'rootContainerGroups']),
    activeUsers: vm => vm.getActiveUsers('activity', vm.activityId)
  },
  methods: {
    ...mapActions('repository', ['initialize']),
    selectElement(element) {
      this.selectedElement = element;
      const selectedElementId = getElementId(element);
      const { elementId: queryElementId, ...query } = this.$route.query;
      if (selectedElementId === queryElementId) return;
      if (selectedElementId) query.elementId = selectedElementId;
      this.$router.replace({ query });
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
  components: {
    ActivityContent,
    Sidebar,
    Toolbar
  }
};
</script>

<style lang="scss" scoped>
$sidebar-width: 400px;

.editor-content-container {
  display: flex;
  height: calc(100% - 50px);

  .sidebar {
    flex-basis: $sidebar-width;
  }

  .activity-content {
    flex-grow: 1;
    flex-basis: calc(100% - #{$sidebar-width});
  }
}
</style>
