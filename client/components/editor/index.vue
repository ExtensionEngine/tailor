<template>
  <div @mousedown="onMousedown" @click="onClick" class="editor">
    <loader v-if="showLoader"></loader>
    <div v-else>
      <toolbar></toolbar>
      <div class="container">
        <h2>
          <span v-for="(item, index) in breadcrumbs">
            {{ item.name }}
            <span v-show="index !== (breadcrumbs.length - 1)"> | </span>
          </span>
        </h2>
        <perspectives></perspectives>
        <assessments></assessments>
      </div>
    </div>
  </div>
</template>

<script>
import find from 'lodash/find';
import Loader from '../common/Loader';
import { mapActions, mapGetters, mapMutations } from 'vuex-module';
import Perspectives from './structure/Perspectives';
import Promise from 'bluebird';
import Toolbar from './toolbar';
import Assessments from './structure/Assessments';

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
    ...mapGetters({
      focusedElement: 'focusedElement',
      openedActivity: 'activity'
    }, 'editor'),
    ...mapGetters(['course', 'activity'], 'course'),
    breadcrumbs() {
      let hasParent = true;
      const items = [this.openedActivity];

      while (hasParent) {
        let parentActivity = find(this.activities, {
          'id': items[items.length - 1].parentId
        });
        items.push(parentActivity);
        if (!parentActivity.parentId) hasParent = false;
      }
      return items.reverse();
    }
  },
  methods: {
    ...mapActions(['focusoutElement'], 'editor'),
    ...mapActions({ getCourse: 'get' }, 'courses'),
    ...mapActions({ getActivities: 'fetch' }, 'activities'),
    ...mapActions({ getTeachingElements: 'fetch' }, 'tes'),
    ...mapMutations({ setupActivitiesApi: 'setBaseUrl' }, 'activities'),
    ...mapMutations({ setupTesApi: 'setBaseUrl' }, 'tes'),
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

  h2 {
    margin: 80px 0 30px 0;
    font-size: 20px;
    color: #444;
    text-align: left;
  }

  .loader {
    margin-top: 150px;
  }
}
</style>
