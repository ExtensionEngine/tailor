<template>
  <div
    ref="activityContent"
    @mousedown="mousedownCaptured = true"
    @click="onClick"
    class="activity-content blue-grey lighten-5">
    <div class="content-containers-wrapper">
      <content-loader v-if="isLoading" class="loader" />
      <template v-else>
        <content-containers
          v-for="(containerGroup, type) in rootContainerGroups"
          :key="type"
          @focusoutElement="focusoutElement"
          v-bind="getContainerConfig(type)"
          :container-group="containerGroup"
          :processed-elements="isPublishedPreview ? changesSincePublish : processedElements"
          :parent-id="activityId" />
      </template>
    </div>
  </div>
</template>

<script>
import { getElementId, isQuestion } from 'tce-core/utils';
import { mapActions, mapGetters, mapState } from 'vuex';
import assignWith from 'lodash/assignWith';
import cloneDeep from 'lodash/cloneDeep';
import commentEventListeners from 'components/common/mixins/commentEventListeners';
import ContentContainers from './ContainerList';
import ContentLoader from './Loader';
import debounce from 'lodash/debounce';
import differenceBy from 'lodash/differenceBy';
import filter from 'lodash/filter';
import find from 'lodash/find';
import get from 'lodash/get';
import { getSupportedContainers } from 'shared/activities';
import isAfter from 'date-fns/isAfter';
import isEqual from 'lodash/isEqual';
import loader from '@/components/common/loader';
import map from 'lodash/map';
import { mapChannels } from '@/plugins/radio';
import mapValues from 'lodash/mapValues';
import pickBy from 'lodash/pickBy';
import revisionApi from '@/api/revision';
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
    ...mapGetters('repository/comments', ['getComments']),
    ...mapState('repository/comments', ['seen']),
    ...mapState({ user: state => state.auth.user }),
    ...mapState('editor', ['isPublishedPreview']),
    activityId: vm => vm.activity.id,
    containerIds: vm => vm.contentContainers.map(it => it.id),
    processedElements() {
      const { elements, seen, activityId } = this;
      return transform(elements, (acc, it) => {
        const comments = this.getComments({ activityId, contentElementId: it.id });
        const lastSeen = seen.contentElement[it.uid] || 0;
        acc[it.uid] = { ...it, comments, lastSeen };
      }, {});
    },
    elementsWithPublishFlags() {
      const elements = pickBy(this.processedElements, this.isActivityElement);
      return mapValues(elements, this.addPublishFlags);
    },
    changesSincePublish() {
      const { elementsWithPublishFlags, publishedRevisions } = this;
      return this.unionElementsAndRevisions(elementsWithPublishFlags, publishedRevisions);
    },
    containerConfigs: vm => getSupportedContainers(vm.activity.type)
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
      const { contentContainers, activityId } = this;
      const ids = contentContainers.map(it => it.id);
      if (ids.length <= 0) return;
      return Promise.all([
        this.getContentElements({ ids }),
        this.fetchComments({ activityId })
      ]);
    }, 'isLoading', 800),
    initElementChangeWatcher() {
      this.storeUnsubscribe = this.$store.subscribe(debounce((mutation, state) => {
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
      }, 100));
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
        const element = this.$refs.activityContent.querySelector(elementId);
        element.scrollIntoView();
      }, timeout);
    },
    fetchRevisions() {
      const modifiedElements = filter(this.elementsWithPublishFlags, 'isModified');
      const query = {
        activityIds: this.containerIds,
        entityIds: map(modifiedElements, 'id'),
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
    unionElementsAndRevisions(elements, revisions) {
      elements = cloneDeep(elements);
      return assignWith(elements, revisions, (element, revision) => ({
        ...element,
        ...revision,
        isRemoved: !element,
        isPublished: !element || element.isPublished
      }));
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
    isLoading(val) {
      const { elementId } = this.$route.query;
      if (val || !elementId) return;
      // Select and scroll to element if elementId is set
      setTimeout(() => {
        this.selectElement(elementId);
        this.scrollToElement(elementId);
        this.collaboratorSelections
          .forEach(({ elementId, ...user }) => this.selectElement(elementId, user));
      }, CE_SELECTION_DELAY);
    },
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
    isPublishedPreview(isOn) {
      if (!isOn) return;
      this.editorChannel.emit(CE_FOCUS_EVENT);
      this.fetchRevisions();
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
    ContentLoader
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
