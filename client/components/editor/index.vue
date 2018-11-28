<template>
  <div class="editor-wrapper">
    <toolbar>
      <span slot="actions">
        <span
          v-if="metadata.length"
          @click="showSidebar = !showSidebar"
          class="btn btn-fab btn-primary">
          <span class="mdi mdi-wrench"></span>
        </span>
      </span>
    </toolbar>
    <transition name="slide">
      <sidebar
        v-if="showSidebar"
        :metadata="metadata"
        :element="focusedElement">
      </sidebar>
    </transition>
    <div @mousedown="onMousedown" @click="onClick" class="editor">
      <circular-progress v-if="showLoader"></circular-progress>
      <div v-else>
        <div class="container">
          <content-containers
            v-for="(containerGroup, type) in contentContainers"
            :key="type"
            :containerGroup="containerGroup"
            :parentId="activity.id"
            v-bind="getContainerConfig(type)">
          </content-containers>
          <assessments v-if="showAssessments"></assessments>
          <exams v-if="showExams"></exams>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as config from 'shared/activities';
import { mapActions, mapGetters, mapMutations } from 'vuex-module';
import Assessments from './structure/Assessments';
import CircularProgress from 'components/common/CircularProgress';
import ContentContainers from './structure/ContentContainers';
import Exams from './structure/Exams';
import find from 'lodash/find';
import Promise from 'bluebird';
import Sidebar from './sidebar';
import Toolbar from './toolbar';
import truncate from 'truncate';

export default {
  name: 'editor',
  data() {
    return {
      showLoader: true,
      showSidebar: false,
      mousedownCaptured: false
    };
  },
  computed: {
    ...mapGetters(['activities']),
    ...mapGetters(['activity', 'contentContainers', 'focusedElement'], 'editor'),
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
    ...mapActions(['focusoutElement'], 'editor'),
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
      if (!this.focusedElement) return;
      if (!e.component ||
        ((e.component.data._cid !== this.focusedElement._cid) &&
        (e.component.data.id !== this.focusedElement.id))) {
        this.focusoutElement();
      }
    }
  },
  watch: {
    focusedElement(next, previous) {
      if (next._cid !== previous._cid) this.showSidebar = false;
    }
  },
  created() {
    this.focusoutElement();
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
.editor-wrapper {
  display: flex;
  flex-direction: column;
}

.editor {
  padding-top: 110px;
  overflow-y: scroll;
  overflow-y: overlay;

  .breadcrumbs {
    margin: 70px 0 10px;
    color: #555;
    font-family: Arial, sans-serif;
    font-size: 14px;
    line-height: 20px;
    text-align: left;
  }

  h2 {
    margin: 20px 0 30px;
    color: #444;
    font-size: 20px;
    line-height: 30px;
    text-align: left;

    a {
      margin-left: 15px;
    }
  }

  .circular-progress {
    margin-top: 150px;
  }

  .divider {
    padding: 0 10px;
    color: #999;
  }
}

.slide-enter-active, .slide-leave-active {
  transition: margin-right 0.5s;
}

.slide-enter, .slide-leave-to {
  margin-right: -300px;
}
</style>
