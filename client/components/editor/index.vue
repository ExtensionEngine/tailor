<template>
  <div class="editor-wrapper">
    <toolbar :element="focusedElement">
      <span slot="actions">
        <v-btn
          v-if="metadata.length"
          @click="showSidebar = !showSidebar"
          color="blue-grey"
          fab
          dark
          title="Toggle teaching element sidebar">
          <v-icon>mdi-backburger</v-icon>
        </v-btn>
      </span>
    </toolbar>
    <transition name="slide">
      <meta-sidebar
        v-if="showSidebar"
        :key="focusedElement._cid"
        :metadata="metadata"
        :element="focusedElement">
      </meta-sidebar>
    </transition>
    <div @mousedown="onMousedown" @click="onClick" class="editor">
      <circular-progress v-if="showLoader"/>
      <template v-else>
        <main-sidebar :activity="activity" :focusedElement="focusedElement"/>
        <div class="container">
          <content-containers
            v-for="(containerGroup, type) in contentContainers"
            :key="type"
            :containerGroup="containerGroup"
            :parentId="activity.id"
            v-bind="getContainerConfig(type)"/>
          <assessments v-if="showAssessments"/>
          <exams v-if="showExams"/>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import * as config from 'shared/activities';
import { mapActions, mapGetters, mapMutations } from 'vuex-module';
import { getElementId, isQuestion } from 'tce-core/utils';
import Assessments from './structure/Assessments';
import CircularProgress from 'components/common/CircularProgress';
import ContentContainers from './structure/ContentContainers';
import debounce from 'lodash/debounce';
import EventBus from 'EventBus';
import Exams from './structure/Exams';
import find from 'lodash/find';
import get from 'lodash/get';
import MainSidebar from './MainSidebar';
import MetaSidebar from './MetaSidebar';
import Promise from 'bluebird';
import throttle from 'lodash/throttle';
import Toolbar from './Toolbar';
import truncate from 'truncate';

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
    ...mapGetters(['activities']),
    ...mapGetters(['activity', 'contentContainers'], 'editor'),
    ...mapGetters(['getMetadata'], 'course'),
    metadata() {
      if (!this.focusedElement) return [];
      return this.getMetadata(this.focusedElement);
    },
    showAssessments() {
      return config.hasAssessments(this.activity.type);
    },
    showExams() {
      return config.hasExams(this.activity.type);
    },
    containerConfigs() {
      if (!this.activity) return [];
      return config.getSupportedContainers(this.activity.type);
    }
  },
  methods: {
    ...mapActions({ getCourse: 'get' }, 'courses'),
    ...mapActions({ getActivities: 'fetch' }, 'activities'),
    ...mapActions({ getTeachingElements: 'fetch' }, 'tes'),
    ...mapMutations({ setupActivitiesApi: 'setBaseUrl' }, 'activities'),
    ...mapMutations({ setupTesApi: 'setBaseUrl' }, 'tes'),
    getContainerConfig(type) {
      return find(this.containerConfigs, { type });
    },
    truncate(str, len = 50) {
      return truncate(str, len);
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
    const courseId = this.$route.params.courseId;
    const activityId = this.$route.params.activityId;
    const baseUrl = `/courses/${courseId}`;
    this.setupActivitiesApi(`${baseUrl}/activities`);
    this.setupTesApi(`${baseUrl}/tes`);
    if (!this.course) this.getCourse(courseId);
    Promise.join(
      this.getActivities(),
      this.getTeachingElements({ activityId, parentId: activityId }),
      Promise.delay(700)
    ).then(() => (this.showLoader = false));
  },
  beforeDestroy() {
    this.unsubscribe();
  },
  components: {
    Assessments,
    CircularProgress,
    ContentContainers,
    Exams,
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
}

.editor {
  padding: 20px 50px 0 50px;
  overflow-y: scroll;
  overflow-y: overlay;

  .container {
    max-width: 1100px;
  }

  .circular-progress {
    margin-top: 150px;
  }
}
</style>
