<template>
  <div @mousedown="onMousedown" @click="onClick" class="editor">
    <loader v-if="showLoader"></loader>
    <div v-else>
      <toolbar></toolbar>
      <div class="container">
        <div class="breadcrumbs">
          <span v-for="(item, index) in breadcrumbs">
            {{ truncate(item.name) }}
            <span
              v-if="index !== (breadcrumbs.length - 1)"
              class="mdi mdi-chevron-right">
            </span>
          </span>
        </div>
        <h2>{{ activity.name }}</h2>
        <introduction v-if="showIntroduction"></introduction>
        <perspectives v-if="showPerspectives"></perspectives>
        <assessments v-if="showAssessments"></assessments>
        <exams v-if="showExams"></exams>
      </div>
    </div>
  </div>
</template>

<script>
import Assessments from './structure/Assessments';
import * as config from 'shared/activities';
import Exams from './structure/Exams';
import find from 'lodash/find';
import Introduction from './structure/Introduction';
import Loader from '../common/Loader';
import { mapActions, mapGetters, mapMutations } from 'vuex-module';
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
        ((e.component.name !== 'toolbar') &&
        ((e.component.data._cid !== this.focusedElement._cid) &&
        (e.component.data.id !== this.focusedElement.id)))) {
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
      Promise.delay(500)
    ).then(() => (this.showLoader = false));
  },
  components: {
    Assessments,
    Exams,
    Introduction,
    Loader,
    Perspectives,
    Toolbar
  }
};
</script>

<style lang="scss" scoped>
.editor {
  // Force scroll
  min-height: 101%;

  .breadcrumbs {
    margin: 70px 0 10px 0;
    font-family: Arial, sans-serif;
    font-size: 14px;
    line-height: 20px;
    color: #555;
    text-align: left;
  }

  h2 {
    margin: 20px 0 30px 0;
    font-size: 20px;
    line-height: 30px;
    color: #444;
    text-align: left;
  }

  .loader {
    margin-top: 150px;
  }

  .divider {
    padding: 0 10px;
    color: #999;
  }
}
</style>
