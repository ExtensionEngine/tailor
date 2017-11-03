<template>
  <div class="editor-wrapper">
    <toolbar></toolbar>
    <div @mousedown="onMousedown" @click="onClick" class="editor">
      <circular-progress v-if="showLoader"></circular-progress>
      <div v-else>
        <div class="container">
          <div class="breadcrumbs">
            <span v-for="(item, index) in breadcrumbs" :key="item.id">
              {{ truncate(item.data.name) }}
              <span
                v-if="index !== (breadcrumbs.length - 1)"
                class="mdi mdi-chevron-right">
              </span>
            </span>
          </div>
          <h2>
            {{ activity.data.name }}
            <a v-if="previewUrl" :href="previewUrl" class="preview-link" target="_blank">
              <span class="mdi mdi-eye"></span>
            </a>
          </h2>
          <introduction v-if="showIntroduction"></introduction>
          <perspectives v-if="showPerspectives"></perspectives>
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
import Exams from './structure/Exams';
import find from 'lodash/find';
import format from 'string-template';
import Introduction from './structure/Introduction';
import Perspectives from './structure/Perspectives';
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
    ...mapGetters(['focusedElement', 'activity'], 'editor'),
    ...mapGetters(['course'], 'course'),
    showIntroduction() {
      return config.hasIntroduction(this.activity.type);
    },
    showPerspectives() {
      return config.hasPerspectives(this.activity.type);
    },
    showAssessments() {
      return config.hasAssessments(this.activity.type);
    },
    showExams() {
      return config.hasExams(this.activity.type);
    },
    breadcrumbs() {
      let items = [];
      let item = this.activity;
      while (item) {
        item = find(this.activities, { id: item.parentId });
        if (item) items.unshift(item);
      };
      return items;
    },
    previewUrl() {
      if (!config.PREVIEW_URL) return;
      const { courseId, activityId } = this.$route.params;
      return format(config.PREVIEW_URL, { courseId, activityId });
    }
  },
  methods: {
    ...mapActions(['focusoutElement'], 'editor'),
    ...mapActions({ getCourse: 'get' }, 'courses'),
    ...mapActions({ getActivities: 'fetch' }, 'activities'),
    ...mapActions({ getTeachingElements: 'fetch' }, 'tes'),
    ...mapMutations({ setupActivitiesApi: 'setBaseUrl' }, 'activities'),
    ...mapMutations({ setupTesApi: 'setBaseUrl' }, 'tes'),
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
    Exams,
    Introduction,
    Perspectives,
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
