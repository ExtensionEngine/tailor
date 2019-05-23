<template>
  <v-navigation-drawer
    top="55"
    absolute
    mini-variant
    mini-variant-width="60"
    permanent
    stateless
    class="blue-grey lighten-4 actions">
    <v-toolbar flat class="transparent">
      <v-list class="pa-0">
        <v-btn
          v-for="({ name, icon, action }) in actions"
          :key="name"
          @click.stop="action"
          color="blue-grey darken-4"
          icon
          flat>
          <v-icon>mdi-{{ icon }}</v-icon>
        </v-btn>
      </v-list>
    </v-toolbar>
  </v-navigation-drawer>
</template>

<script>
import ActivitySidebar from '../../course/Sidebar/Body';
import Discussion from '../../course/Sidebar/Discussion';
import format from 'string-template';
import { mapGetters } from 'vuex-module';
import publishMixin from 'components/common/mixins/publish';
import RepoNavigation from './RepoNavigation';

const { PREVIEW_URL } = process.env;

export default {
  mixins: [publishMixin],
  props: {
    activity: { type: Object, required: true },
    focusedElement: { type: Object, default: null }
  },
  computed: {
    ...mapGetters(['course', 'getMetadata', 'outlineActivities'], 'course'),
    metadata() {
      return this.getMetadata(this.focusedElement);
    },
    actions() {
      const { $router, activity: { courseId } } = this;
      return [{
        title: 'Back',
        icon: 'arrow-left',
        action: () => $router.push({ name: 'course', params: { courseId } })
      }, {
        title: 'Preview',
        icon: 'eye',
        action: () => window.open(this.previewUrl, '_blank')
      }, {
        title: 'Publish',
        icon: 'upload',
        action: () => this.confirmPublishing(this.activity)
      }];
    },
    previewUrl() {
      if (!PREVIEW_URL) return;
      const { courseId, id } = this.activity;
      return format(PREVIEW_URL, { repositoryId: courseId, activityId: id });
    }
  },
  components: { ActivitySidebar, Discussion, RepoNavigation }
};
</script>

<style lang="scss" scoped>
.sidebar-panel, .actions {
  padding-top: 60px;
}

.sidebar-panel {
  width: 340px;
  max-width: 340px;
}
</style>
