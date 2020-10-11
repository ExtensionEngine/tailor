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
        :content-containers="contentContainers" />
    </template>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import ActivityContent from './ActivityContent';
import get from 'lodash/get';
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
    ...mapGetters('editor', ['activity', 'contentContainers']),
    activeUsers: vm => vm.getActiveUsers('activity', vm.activityId)
  },
  methods: mapActions('repository', ['initialize']),
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
.editor-container {
  display: flex;
  flex-direction: column;
}
</style>
