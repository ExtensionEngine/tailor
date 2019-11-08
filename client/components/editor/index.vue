<template>
  <div class="editor-wrapper">
    <template v-if="activity">
      <toolbar :element="focusedElement">
        <span slot="actions">
          <v-btn
            v-if="metadata.length"
            @click="showSidebar = !showSidebar"
            color="primary"
            fab
            dark
            title="Toggle teaching element sidebar">
            <v-icon>mdi-backburger</v-icon>
          </v-btn>
        </span>
      </toolbar>
      <main-sidebar :activity="activity" :focused-element="focusedElement" />
      <transition name="slide">
        <meta-sidebar
          v-if="showSidebar"
          :key="focusedElement._cid"
          :metadata="metadata"
          :element="focusedElement" />
      </transition>
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
import * as config from 'shared/activities';
import { getElementId, isQuestion } from 'tce-core/utils';
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
import MetaSidebar from './MetaSidebar';
import Promise from 'bluebird';
import throttle from 'lodash/throttle';
import Toolbar from './Toolbar';

export default {
  name: 'editor',
  data() {
    return {
      showLoader: true,
      focusedElement: null,
      showSidebar: false,
      mousedownCaptured: false
    };
  },
  computed: {
    ...mapGetters('course', ['course', 'getMetadata']),
    ...mapGetters('editor', ['activity', 'contentContainers']),
    metadata() {
      if (!this.focusedElement) return [];
      return this.getMetadata(this.focusedElement);
    },
    showAssessments() {
      return config.hasAssessments(this.activity.type);
    },
    containerConfigs() {
      if (!this.activity) return [];
      return config.getSupportedContainers(this.activity.type);
    }
  },
  methods: {
    ...mapActions('courses', { getCourse: 'get' }),
    ...mapActions('activities', {
      getActivities: 'fetch',
      setupActivitiesApi: 'setEndpoint'
    }),
    ...mapActions('tes', {
      getTeachingElements: 'fetch',
      setupTesApi: 'setEndpoint'
    }),
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
  created() {
    const { courseId, activityId } = this.$route.params;
    this.unsubscribe = this.$store.subscribe(debounce((mutation, state) => {
      const { type, payload: element } = mutation;
      const { focusedElement } = this;
      if (!focusedElement) return;
      if (!['tes/save', 'tes/add', 'tes/update'].includes(type)) return;
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
        this.showSidebar = false;
        return;
      }
      if (getElementId(this.focusedElement) === getElementId(element)) return;
      this.focusedElement = { ...element, parent: composite };
      this.showSidebar = this.metadata.length && this.showSidebar;
    }, 50));
    // TODO: Do this better!
    const baseUrl = `/repositories/${courseId}`;
    this.setupActivitiesApi(`${baseUrl}/activities`);
    this.setupTesApi(`${baseUrl}/content-elements`);
    const actions = [this.getActivities()];
    if (!this.course) actions.push(this.getCourse(courseId));
    Promise.all(actions).then(() => {
      const ids = flatMap(this.contentContainers, it => map(it, 'id'));
      return this.getTeachingElements({ ids: [activityId, ...ids] });
    })
    .then(() => (this.showLoader = false));
  },
  beforeDestroy() {
    this.unsubscribe();
  },
  components: {
    Assessments,
    ContentContainers,
    MainSidebar,
    MetaSidebar,
    Toolbar
  }
};
</script>

<style lang="scss" scoped>
@import '~bootswatch/paper/variables';

.editor-wrapper {
  display: flex;
  flex-direction: column;

  .v-progress-circular {
    align-self: center;
    margin-top: 120px;
  }
}

.editor {
  padding: 20px 50px 0;
  overflow-y: scroll;
  overflow-y: overlay;

  .container {
    max-width: 1100px;
  }
}
</style>
