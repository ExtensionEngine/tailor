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
      <sidebar
        v-if="showSidebar"
        :key="focusedElement._cid"
        :metadata="metadata"
        :element="focusedElement">
      </sidebar>
    </transition>
    <div @mousedown="onMousedown" @click="onClick" class="editor">
      <circular-progress v-if="showLoader"/>
      <div v-else>
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
      </div>
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
import Promise from 'bluebird';
import Sidebar from './sidebar';
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
    ...mapGetters(['course', 'getMetadata'], 'course'),
    metadata() {
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
    Sidebar,
    Toolbar
  }
};
</script>

<style lang="scss" scoped>
@import '~bootswatch/paper/variables';

.editor-wrapper {
  display: flex;
  flex-direction: column;

  .btn.btn-fab.btn-primary[disabled] {
    opacity: 1;
    background: mix($brand-primary, $gray-light, 25);
    box-shadow: none;
  }
}

.editor {
  padding-top: 80px;
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
