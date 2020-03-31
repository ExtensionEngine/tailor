<template>
  <div class="editor-wrapper">
    <template v-if="activity">
      <toolbar :element="focusedElement" />
      <main-sidebar
        :activity="activity"
        :focused-element="focusedElement" />
    </template>
    <div @mousedown="onMousedown" @click="onClick" class="editor">
      <div class="container">
        <v-progress-circular v-if="showLoader" color="primary" indeterminate />
        <template v-else>
          <content-containers
            v-for="(containerGroup, type) in contentContainers"
            :key="type"
            :container-group="containerGroup"
            :parent-id="activity.id"
            v-bind="getContainerConfig(type)" />
          <assessments v-if="showAssessments" />
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { getElementId, isQuestion } from 'tce-core/utils';
import { getSupportedContainers, hasAssessments } from 'shared/activities';
import { mapActions, mapGetters } from 'vuex';
import Assessments from './structure/Assessments';
import ContentContainers from './structure/ContentContainers';
import debounce from 'lodash/debounce';
import EventBus from 'EventBus';
import find from 'lodash/find';
import flatMap from 'lodash/flatMap';
import get from 'lodash/get';
import MainSidebar from './MainSidebar';
import map from 'lodash/map';
import throttle from 'lodash/throttle';
import Toolbar from './Toolbar';

export default {
  name: 'editor',
  data: () => ({
    showLoader: true,
    focusedElement: null,
    mousedownCaptured: false
  }),
  computed: {
    ...mapGetters('repository', ['repository']),
    ...mapGetters('editor', ['activity', 'contentContainers']),
    showAssessments: vm => hasAssessments(vm.activity.type),
    containerConfigs() {
      if (!this.activity) return [];
      return getSupportedContainers(this.activity.type);
    }
  },
  methods: {
    ...mapActions('repositories', { getRepository: 'get' }),
    ...mapActions('repository', ['initialize']),
    ...mapActions('repository/tes', { getTeachingElements: 'fetch' }),
    getContainerConfig(type) {
      return find(this.containerConfigs, { type });
    },
    onMousedown() {
      this.mousedownCaptured = true;
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
    }
  },
  async created() {
    const { repositoryId, activityId } = this.$route.params;
    this.unsubscribe = this.$store.subscribe(debounce((mutation, state) => {
      const { type, payload: element } = mutation;
      const { focusedElement } = this;
      if (!focusedElement) return;
      const module = 'repository/tes';
      if (![`${module}/save`, `${module}/add`, `${module}/update`].includes(type)) return;
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
    EventBus.on('element:focus', throttle((element, composite) => {
      if (!element) {
        this.focusedElement = null;
        return;
      }
      if (getElementId(this.focusedElement) === getElementId(element)) return;
      this.focusedElement = { ...element, parent: composite };
    }, 50));
    if (!this.repository || this.repository.id !== repositoryId) {
      await this.initialize(repositoryId);
    }
    const ids = flatMap(this.contentContainers, it => map(it, 'id'));
    await this.getTeachingElements({ ids: [activityId, ...ids] });
    this.showLoader = false;
  },
  beforeDestroy() {
    this.unsubscribe();
  },
  components: {
    Assessments,
    ContentContainers,
    MainSidebar,
    Toolbar
  }
};
</script>

<style lang="scss" scoped>
@import "~bootswatch/paper/variables";

.editor-wrapper {
  display: flex;
  flex-direction: column;

  .v-progress-circular {
    align-self: center;
    margin-top: 120px;
  }
}

.editor {
  padding: 70px 25px 0 420px;
  overflow-y: scroll;
  overflow-y: overlay;

  .container {
    max-width: 1100px;
  }
}
</style>
