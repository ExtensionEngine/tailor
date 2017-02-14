<template>
  <div class="editor" @click="clicked">
    <loader v-if="showLoader"></loader>
    <div v-else>
      <toolbar></toolbar>
      <div class="container">
        <h2>{{ activity.name }}</h2>
        <perspectives></perspectives>
        <assessments></assessments>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex-module';
import Assessments from './structure/Assessments';
import Loader from '../common/Loader';
import Perspectives from './structure/Perspectives';
import Promise from 'bluebird';
import Toolbar from './toolbar';

export default {
  name: 'editor',
  data() {
    return {
      showLoader: true
    };
  },
  computed: {
    ...mapGetters(['course', 'activity'], 'editor'),
    ...mapGetters(['toolbar'])
  },
  methods: {
    ...mapActions({ getCourse: 'get' }, 'courses'),
    ...mapActions({ getActivities: 'fetch' }, 'activity'),
    ...mapActions({ getAssets: 'fetch' }, 'assets'),
    ...mapActions({ getAssessments: 'fetch' }, 'assessments'),
    ...mapMutations({ setupActivityApi: 'setBaseUrl' }, 'activity'),
    ...mapMutations({ setupAssetsApi: 'setBaseUrl' }, 'assets'),
    ...mapMutations({ setupAssessmentApi: 'setBaseUrl' }, 'assessments'),
    clicked(e) {
      if (!this.toolbar.type) return;
      if (!e.component ||
        ((e.component.name !== 'toolbar') &&
        (e.component.data._cid !== this.toolbar.context._cid))) {
        this.clearContext();
      }
    },
    ...mapMutations({ clearContext: 'setToolbar' })
  },
  created() {
    // TODO: Do this better!
    const courseId = this.$route.params.courseKey;
    const activityId = this.$route.params.activityKey;

    const baseUrl = `/courses/${courseId}`;
    this.setupActivityApi(`${baseUrl}/activities`);
    this.setupAssetsApi(`${baseUrl}/assets`);
    this.setupAssessmentApi(`${baseUrl}/assessments`);
    if (!this.course) this.getCourse(courseId);

    Promise.join(
      this.getAssets({ parentId: activityId }),
      this.getActivities(),
      this.getAssessments({ activityId }),
      Promise.delay(500)
    ).then(() => (this.showLoader = false));
  },
  components: {
    Toolbar,
    Perspectives,
    Assessments,
    Loader
  }
};
</script>

<style lang="scss">
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
