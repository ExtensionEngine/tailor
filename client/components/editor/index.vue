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
        @selected="selectElement"
        :repository="repository"
        :activity="activity"
        :root-container-groups="rootContainerGroups"
        :content-containers="contentContainers" />
    </template>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex';
import ActivityContent from './ActivityContent';
import get from 'lodash/get';
import { getElementId } from 'tce-core/utils';
import map from 'lodash/map';
import { mapChannels } from '@/plugins/radio';
import Sidebar from './Sidebar';
import Toolbar from './Toolbar';
import transform from 'lodash/transform';
import withUserTracking from 'components/common/mixins/userTracking';

const COMMENT_EVENTS = [
  { event: 'comment:save', action: 'upsertComment' },
  { event: 'comment:remove', action: 'deleteComment' },
  { event: 'comment:set-last-seen', action: 'setLastSeenComment' }
];

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
    ...mapChannels({ editorBus: 'editor' }),
    ...mapGetters('repository/userTracking', ['getActiveUsers']),
    ...mapGetters('repository', ['repository', 'outlineActivities']),
    ...mapGetters('editor', ['activity', 'contentContainers', 'rootContainerGroups']),
    ...mapGetters('repository/comments', ['getUnseenElementComments', 'getComments']),
    ...mapGetters('repository/contentElements', ['elements']),
    activeUsers: vm => vm.getActiveUsers('activity', vm.activityId),
    commentsWithinElements() {
      const { id: activityId, uid: activityUid } = this.activity;
      return transform(this.elements, (acc, it) => {
        const element = { ...it, activityUid, activityId };
        const comments = this.getComments({ activityId, contentElementId: it.id });
        const lastCommentAt = new Date(get(comments[0], 'createdAt', 0)).getTime();
        const unseenComments = this.getUnseenElementComments(element);
        acc[it.id] = { ...it, comments, lastCommentAt, unseenComments };
      }, {});
    }
  },
  methods: {
    ...mapActions('repository', ['initialize']),
    ...mapActions('repository/comments', {
      fetchComments: 'fetch',
      saveComment: 'save',
      updateComment: 'update',
      removeComment: 'remove'
    }),
    ...mapMutations('repository/comments', ['markSeenComments']),
    selectElement(element) {
      this.selectedElement = element;
      const selectedElementId = getElementId(element);
      const { elementId: queryElementId, ...query } = this.$route.query;
      if (selectedElementId === queryElementId) return;
      if (selectedElementId) query.elementId = selectedElementId;
      this.$router.replace({ query });
    },
    async upsertComment(comment) {
      const action = comment.id ? 'updateComment' : 'saveComment';
      await this[action]({ ...comment, activityId: this.activityId });
      return this.emitCommentsData(comment.contentElementId);
    },
    async deleteComment(comment) {
      await this.removeComment(comment);
      return this.emitCommentsData(comment.contentElementId);
    },
    emitCommentsData(elementId) {
      const element = this.commentsWithinElements[elementId];
      const { comments, unseenComments, lastCommentAt } = element;
      const elementBus = this.$radio.channel(`element:${elementId}`);
      elementBus.emit('comments:init', { comments, unseenComments, lastCommentAt });
    },
    setLastSeenComment({ timeout, elementId }) {
      const element = this.commentsWithinElements[elementId];
      const { uid: elementUid, lastCommentAt } = element;
      const payload = { elementUid, lastCommentAt };
      setTimeout(() => {
        this.markSeenComments(payload);
        this.emitCommentsData(elementId);
      }, timeout);
    },
    async initializeComments() {
      await this.fetchComments({ activityId: this.activityId });
      setTimeout(() => map(this.elements, it => this.emitCommentsData(it.id)), 1000);
      COMMENT_EVENTS.forEach(({ event, action }) => {
        this.editorBus.on(event, data => this[action](data));
      });
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
    this.initializeComments();
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
