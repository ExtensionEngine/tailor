<template>
  <div class="editor-container">
    <template v-if="!isLoading">
      <toolbar :element="selectedElement" />
      <main-sidebar :activity="activity" :selected-element="selectedElement" />
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
import MainSidebar from './MainSidebar';
import Toolbar from './Toolbar';

export default {
  name: 'content-editor',
  props: {
    repositoryId: { type: Number, required: true }
  },
  data: () => ({
    isLoading: true,
    selectedElement: null
  }),
  computed: {
    ...mapGetters('repository', ['repository']),
    ...mapGetters('editor', ['activity', 'contentContainers'])
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
    MainSidebar,
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
