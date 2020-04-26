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
          v-bind="getContainerConfig(type)" />
        <assessments v-if="showAssessments" />
      </template>
    </div>
  </div>
</template>

<script>
import { getElementId, isQuestion } from 'tce-core/utils';
import { getSupportedContainers, hasAssessments } from 'shared/activities';
import Assessments from '../structure/Assessments';
import ContentContainers from '../structure/ContentContainers';
import ContentLoader from './Loader';
import debounce from 'lodash/debounce';
import EventBus from 'EventBus';
import find from 'lodash/find';
import get from 'lodash/get';
import { mapActions } from 'vuex';
import Promise from 'bluebird';
import throttle from 'lodash/throttle';

const CE_FOCUS_EVENT = 'element:focus';
const CE_MODULE = 'repository/tes';
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
    focusedElement: null
  }),
  computed: {
    containerConfigs: vm => getSupportedContainers(vm.activity.type),
    showAssessments: vm => hasAssessments(vm.activity.type)
  },
  methods: {
    ...mapActions('repository/tes', { getTeachingElements: 'fetch' }),
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
        EventBus.emit('element:focus');
      }
    },
    initElementChangeWatcher() {
      this.storeUnsubscribe = this.$store.subscribe(debounce((mutation, state) => {
        const { type, payload: element } = mutation;
        const { focusedElement } = this;
        if (!focusedElement || !ELEMENT_MUTATIONS.includes(type)) return;
        if (element._cid === focusedElement._cid) {
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
      this.eventBus = EventBus.on(CE_FOCUS_EVENT, throttle((element, composite) => {
        if (!element) {
          this.focusedElement = null;
          return;
        }
        if (getElementId(this.focusedElement) === getElementId(element)) return;
        this.focusedElement = { ...element, parent: composite };
      }, 50));
    }
  },
  watch: {
    focusedElement: {
      deep: true,
      handler(val) {
        this.$emit('selected', val);
      }
    }
  },
  async created() {
    // Reset element focus
    this.$emit('selected', null);
    const { activity } = this;
    const ids = this.contentContainers.map(it => it.id);
    await Promise.all([
      this.getTeachingElements({ ids: [activity.id, ...ids] }),
      Promise.delay(800)
    ]);
    this.isLoading = false;
    this.initElementFocusListener();
    this.initElementChangeWatcher();
  },
  beforeDestroy() {
    this.storeUnsubscribe && this.storeUnsubscribe();
    this.eventBus && this.eventBus.$off(CE_FOCUS_EVENT);
  },
  components: {
    Assessments,
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
