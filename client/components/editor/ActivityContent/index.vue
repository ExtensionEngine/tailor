<template>
  <div
    @mousedown="mousedownCaptured = true"
    @click="onClick"
    class="activity-content blue-grey lighten-5">
    <div class="content-containers-wrapper">
      <content-loader v-if="isLoading" class="loader" />
      <template v-else>
        <content-containers
          v-for="(containerGroup, type) in rootContainerGroups"
          :key="type"
          :container-group="containerGroup"
          :parent-id="activity.id"
          :elements="activityElements"
          :revisions="revisions"
          v-bind="getContainerConfig(type)" />
      </template>
    </div>
  </div>
</template>

<script>
import { getElementId, isQuestion } from 'tce-core/utils';
import { mapActions, mapGetters, mapState } from 'vuex';
import ContentContainers from '../structure/ContentContainers';
import ContentLoader from './Loader';
import debounce from 'lodash/debounce';
import filter from 'lodash/filter';
import find from 'lodash/find';
import get from 'lodash/get';
import { getSupportedContainers } from 'shared/activities';
import isAfter from 'date-fns/isAfter';
import loader from '@/components/common/loader';
import map from 'lodash/map';
import { mapChannels } from '@/plugins/radio';
import mapValues from 'lodash/mapValues';
import pickBy from 'lodash/pickBy';
import revisionApi from '@/api/revision';
import throttle from 'lodash/throttle';

const CE_FOCUS_EVENT = 'element:focus';
const CE_MODULE = 'repository/contentElements';
const ELEMENT_MUTATIONS = [
  `${CE_MODULE}/save`, `${CE_MODULE}/add`, `${CE_MODULE}/update`
];

export default {
  name: 'activity-content',
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
    focusedElement: null,
    revisions: null
  }),
  computed: {
    ...mapState('editor', ['isPublishedPreview']),
    ...mapGetters('repository', ['activities']),
    ...mapGetters('repository/contentElements', ['elements']),
    ...mapChannels({ editorChannel: 'editor' }),
    containerConfigs: vm => getSupportedContainers(vm.activity.type),
    containerIds: vm => vm.contentContainers.map(it => it.id),
    activityElements() {
      const elements = pickBy(this.elements, this.isActivityElement);
      return mapValues(elements, it => ({
        ...it,
        isModified: this.isModifiedElement(it)
      }));
    }
  },
  methods: {
    ...mapActions('repository/contentElements', { getContentElements: 'fetch' }),
    getContainerConfig(type) {
      return find(this.containerConfigs, { type });
    },
    onClick(e) {
      // TODO: Temp, figure out better way to handle this
      // (i.e. stop propagation for cropper)
      if (!this.mousedownCaptured) return;
      // Reset
      this.mousedownCaptured = false;
      if (get(e, 'component.name') !== 'content-element') {
        this.editorChannel.emit(CE_FOCUS_EVENT);
      }
    },
    loadContents: loader(function () {
      if (this.containerIds.length <= 0) return;
      return this.getContentElements({ ids: this.containerIds });
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
    isActivityElement(element) {
      return this.containerIds.some(id => id === element.activityId);
    },
    isModifiedElement(element) {
      return isAfter(new Date(element.updatedAt), new Date(this.activity.publishedAt));
    },
    fetchRevisions() {
      const modifiedActivityElements = filter(this.activityElements, 'isModified');
      const entityIds = map(modifiedActivityElements, 'id');
      return revisionApi.fetch(this.repository.id, {
        entityIds,
        entity: 'CONTENT_ELEMENT',
        createdBefore: this.activity.publishedAt
      })
        .then(revisions => { this.revisions = revisions; });
    }
  },
  watch: {
    focusedElement: {
      deep: true,
      handler(val) {
        this.$emit('selected', val);
      }
    },
    isPublishedPreview(isOn) {
      if (!isOn) return;
      this.editorChannel.emit(CE_FOCUS_EVENT);
      this.fetchRevisions();
    }
  },
  async created() {
    // Reset element focus
    this.$emit('selected', null);
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
  padding: 4.375rem 1.5625rem 0 26.25rem;
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
