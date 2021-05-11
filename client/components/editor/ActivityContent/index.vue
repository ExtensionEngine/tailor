<template>
  <div
    ref="activityContent"
    @mousedown="mousedownCaptured = true"
    @click="onClick"
    class="activity-content primary lighten-5">
    <div class="content-containers-wrapper">
      <content-loader v-if="isLoading" class="loader" />
      <publish-diff-provider
        v-else
        v-slot="{ processedElements, processedActivities, processedContainerGroups }"
        :show-diff="showPublishDiff"
        :elements="elementsWithComments"
        :activities="activities"
        :container-groups="rootContainerGroups"
        :activity-id="activity.id"
        :repository-id="repository.id"
        :publish-timestamp="activity.publishedAt">
        <content-containers
          v-for="(containerGroup, type) in processedContainerGroups"
          :key="type"
          @focusoutElement="focusoutElement"
          v-bind="getContainerConfig(type)"
          :container-group="containerGroup"
          :processed-elements="processedElements"
          :processed-activities="processedActivities"
          :parent-id="activityId" />
      </publish-diff-provider>
    </div>
  </div>
</template>

<script>
import { getElementId, isQuestion } from '@tailor-cms/utils';
import { mapActions, mapGetters, mapState } from 'vuex';
import commentEventListeners from 'components/common/mixins/commentEventListeners';
import ContentContainers from './ContainerList';
import ContentLoader from './Loader';
import differenceBy from 'lodash/differenceBy';
import find from 'lodash/find';
import get from 'lodash/get';
import isEqual from 'lodash/isEqual';
import loader from '@/components/common/loader';
import { mapChannels } from '@extensionengine/vue-radio';
import max from 'lodash/max';
import PublishDiffProvider from './PublishDiffProvider';
import throttle from 'lodash/throttle';
import transform from 'lodash/transform';

const CE_FOCUS_EVENT = 'element:focus';
const CE_SELECT_EVENT = 'element:select';
const CE_SELECTION_DELAY = 1000;
const CE_MODULE = 'repository/contentElements';
const ELEMENT_MUTATIONS = [
  `${CE_MODULE}/save`, `${CE_MODULE}/add`, `${CE_MODULE}/update`
];

export default {
  name: 'activity-content',
  mixins: [commentEventListeners],
  inject: ['$schemaService'],
  props: {
    repository: { type: Object, required: true },
    activity: { type: Object, required: true },
    // grouped by type
    rootContainerGroups: { type: Object, required: true },
    contentContainers: { type: Array, required: true }
  },
  data: () => ({
    isLoading: true,
    mousedownCaptured: null,
    focusedElement: null
  }),
  computed: {
    ...mapChannels({ editorChannel: 'editor' }),
    ...mapGetters('repository', ['activities']),
    ...mapGetters('editor', ['collaboratorSelections']),
    ...mapGetters('repository/contentElements', ['elements']),
    ...mapGetters('repository/activities', ['activities']),
    ...mapGetters('repository/comments', ['getComments']),
    ...mapState('repository/comments', ['seen']),
    ...mapState({ user: state => state.auth.user }),
    ...mapState('editor', ['showPublishDiff']),
    activityId: vm => vm.activity.id,
    containerIds: vm => vm.contentContainers.map(it => it.id),
    elementsWithComments() {
      const { elements, seen } = this;
      const { id: activityId, uid: activityUid } = this.activity;
      return transform(elements, (acc, it) => {
        const comments = this.getComments({ activityId, contentElementId: it.id });
        const lastSeen = max([seen.contentElement[it.uid], seen.activity[activityUid]]);
        const hasUnresolvedComments = !!comments.length;
        acc[it.uid] = { ...it, comments, hasUnresolvedComments, lastSeen: lastSeen || 0 };
      }, {});
    },
    containerConfigs: vm => vm.$schemaService.getSupportedContainers(vm.activity.type)
  },
  methods: {
    ...mapActions('repository/contentElements', { getContentElements: 'fetch' }),
    ...mapActions('repository/comments', { fetchComments: 'fetch' }),
    getContainerConfig(type) {
      return find(this.containerConfigs, { type });
    },
    onClick(e) {
      // TODO: Temp, figure out better way to handle this
      // (i.e. stop propagation for cropper)
      if (!this.mousedownCaptured) return;
      // Reset
      this.mousedownCaptured = false;
      if (get(e, 'component.name') !== 'content-element') this.focusoutElement();
    },
    loadContents: loader(function () {
      const { activityId, containerIds } = this;
      if (containerIds.length <= 0) return;
      return Promise.all([
        this.getContentElements({ ids: containerIds }),
        this.fetchComments({ activityId })
      ]);
    }, 'isLoading', 800),
    initElementChangeWatcher() {
      this.storeUnsubscribe = this.$store.subscribe(mutation => {
        const { type, payload: element } = mutation;
        const { focusedElement } = this;
        if (!focusedElement || !ELEMENT_MUTATIONS.includes(type)) return;
        if (element.uid === focusedElement.uid) {
          this.focusedElement = { ...focusedElement, ...element };
          return;
        }
        const embed = isQuestion(element.type)
          ? find(element.data.question, { id: focusedElement.id })
          : get(element, `data.embeds.${focusedElement.id}`);
        if (!embed) return;
        const hasParent = !!focusedElement.parent;
        this.focusedElement = { ...embed, parent: hasParent ? element : null };
      });
    },
    initElementFocusListener() {
      this.focusHandler = throttle((element, composite) => {
        if (!element) {
          this.focusedElement = null;
          return;
        }
        if (getElementId(this.focusedElement) === getElementId(element)) return;
        this.focusedElement = { ...element, parent: composite };
      }, 50);
      this.editorChannel.on(CE_FOCUS_EVENT, this.focusHandler);
    },
    focusoutElement() {
      this.editorChannel.emit(CE_FOCUS_EVENT);
    },
    selectElement(elementId, user = this.user, isSelected = true) {
      this.editorChannel.emit(CE_SELECT_EVENT, { elementId, user, isSelected });
    },
    scrollToElement(id, timeout = 500) {
      setTimeout(() => {
        const elementId = `#element_${id}`;
        const element = this.$refs.activityContent?.querySelector(elementId);
        if (!element) return;
        element.scrollIntoView({ block: 'center', behavior: 'smooth' });
      }, timeout);
    },
    revealElement() {
      const { elementId } = this.$route.query;
      if (!elementId) return;
      // Select and scroll to element if elementId is set
      this.selectElement(elementId);
      this.scrollToElement(elementId);
    }
  },
  watch: {
    isLoading(val) {
      if (val) return;
      setTimeout(() => {
        this.revealElement();
        this.collaboratorSelections
          .forEach(({ elementId, ...user }) => this.selectElement(elementId, user));
      }, CE_SELECTION_DELAY);
    },
    $route: 'revealElement',
    focusedElement: {
      deep: true,
      handler(val) {
        this.$emit('selected', val);
      }
    },
    collaboratorSelections(val, prevVal) {
      if (this.isLoading || isEqual(val, prevVal)) return;
      const selectionComparator = it => `${it.elementId}-${it.id}`;
      const removeSelection = differenceBy(prevVal, val, selectionComparator);
      const isSelected = differenceBy(val, prevVal, selectionComparator);
      [[removeSelection, false], [isSelected, true]].forEach(([items, isSelected]) => {
        items.forEach(({ elementId, ...user }) => this.selectElement(elementId, user, isSelected));
      });
    },
    showPublishDiff(isOn) {
      if (!isOn) return;
      this.editorChannel.emit(CE_FOCUS_EVENT);
    }
  },
  async created() {
    await this.loadContents();
    this.initElementFocusListener();
    this.initElementChangeWatcher();
  },
  beforeDestroy() {
    this.storeUnsubscribe && this.storeUnsubscribe();
  },
  components: {
    ContentContainers,
    ContentLoader,
    PublishDiffProvider
  }
};
</script>

<style lang="scss" scoped>
.activity-content {
  min-height: 100%;
  padding: 1.25rem 2.5rem 0 1.5625rem;
  overflow-y: scroll;
  overflow-y: overlay;
  overflow-x: hidden;

  .content-containers-wrapper {
    max-width: 68.75rem;
    margin: auto;
  }
}

.loader {
  margin-top: 4.375rem;
}
</style>
