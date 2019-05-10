<template>
  <v-navigation-drawer
    class="elevation-1"
    absolute
    permanent
    stateless
    width="400">
    <v-layout fill-height>
      <v-navigation-drawer
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
      <div class="sidebar-panel">
        <repo-navigation :items="outlineActivities" :selected="activity"/>
      </div>
    </v-layout>
  </v-navigation-drawer>
</template>

<script>
import ActivitySidebar from '../../course/Sidebar/Body';
import format from 'string-template';
import { mapGetters } from 'vuex-module';
import publishMixin from 'components/common/mixins/publish';
import RepoNavigation from './RepoNavigation';

const { PREVIEW_URL } = process.env;

export default {
  mixins: [publishMixin],
  props: {
    activity: { type: Object, required: true }
  },
  computed: {
    ...mapGetters(['outlineActivities'], 'course'),
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
  components: { ActivitySidebar, RepoNavigation }
};
</script>

<style lang="scss" scoped>
.sidebar-panel, .actions {
  padding-top: 70px;
}

.sidebar-panel {
  width: 340px;
  max-width: 340px;
}
</style>
