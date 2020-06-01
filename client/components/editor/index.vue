<template>
  <div class="editor-container">
    <template v-if="!isLoading">
      <toolbar :element="selectedElement" />
      <template slot="active-users">
        <active-users :users="activeUsers" />
      </template>
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
import ActiveUsers from 'components/common/ActiveUsers';
import ActivityContent from './ActivityContent';
import get from 'lodash/get';
import Sidebar from './Sidebar';
import Toolbar from './Toolbar';
import withActiveUsers from 'components/common/mixins/activeUsers';

export default {
  name: 'content-editor',
  mixins: [withActiveUsers],
  props: {
    repositoryId: { type: Number, required: true },
    activityId: { type: Number, required: true }
  },
  data: () => ({
    isLoading: true,
    selectedElement: null
  }),
  computed: {
    ...mapGetters('activeUsers', ['getActiveUsers']),
    ...mapGetters('repository', ['repository', 'outlineActivities']),
    ...mapGetters('editor', ['activity', 'contentContainers']),
    activeUsers() {
      return this.getActiveUsers('activity', this.activityId);
    }
  },
  methods: {
    ...mapActions('repository', ['initialize'])
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
    ActiveUsers,
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
