<template>
  <div class="editor-wrapper">
    <toolbar></toolbar>
    <div @mousedown="onMousedown" @click="onClick" class="editor">
      <circular-progress v-if="showLoader"></circular-progress>
      <div v-else>
        <div class="container">
          <content-containers
            v-for="(containerGroup, name) in contentContainers"
            :key="name"
            :containerGroup="containerGroup"
            :parentId="activity.id"
            v-bind="getContainerConfig(name)">
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
import Toolbar from './toolbar';
import truncate from 'truncate';

export default {
  name: 'editor',
  data() {
    return {
      showLoader: true,
      mousedownCaptured: false
    };
  },
  computed: {
    ...mapGetters(['activities']),
    ...mapGetters(['focusedElement', 'activity', 'contentContainers'], 'editor'),
    ...mapGetters(['course'], 'course'),
    showAssessments() {
      return config.hasAssessments(this.activity.type);
    },
    showExams() {
      return config.hasExams(this.activity.type);
    }
  },
  methods: {
    ...mapActions(['focusoutElement'], 'editor'),
    ...mapActions({ getCourse: 'get' }, 'courses'),
    ...mapActions({ getActivities: 'fetch' }, 'activities'),
    ...mapActions({ getTeachingElements: 'fetch' }, 'tes'),
    ...mapMutations({ setupActivitiesApi: 'setBaseUrl' }, 'activities'),
    ...mapMutations({ setupTesApi: 'setBaseUrl' }, 'tes'),
    getContainerConfig(name) {
      const type = name.toUpperCase();
      return find(config.CONTENT_CONTAINERS, { type });
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
</style>
