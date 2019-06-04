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
        <v-tooltip
          v-for="({ title, icon, action }) in actions"
          :key="title"
          color="blue-grey darken-3"
          right>
          <template v-slot:activator="{ on }">
            <v-btn
              v-on="on"
              @click.stop="action"
              color="blue-grey darken-4"
              icon
              flat>
              <v-icon>mdi-{{ icon }}</v-icon>
            </v-btn>
          </template>
          <span>{{ title }}</span>
        </v-tooltip>
      </v-list>
    </v-toolbar>
  </v-navigation-drawer>
</template>

<script>
import { mapActions, mapGetters } from 'vuex-module';
import ActivitySidebar from '../../course/Sidebar/Body';
import Discussion from '../../course/Sidebar/Discussion';
import format from 'string-template';
import publishMixin from 'components/common/mixins/publish';

const { PREVIEW_URL } = process.env;

export default {
  mixins: [publishMixin],
  props: {
    activity: { type: Object, required: true },
    focusedElement: { type: Object, default: null }
  },
  computed: {
    ...mapGetters(['isAdmin']),
    ...mapGetters(['outlineActivities', 'isCourseAdmin'], 'course'),
    actions() {
      const { $router, activity: { courseId } } = this;
      const items = [{
        title: 'Back',
        icon: 'arrow-left',
        action: () => $router.push({ name: 'course', params: { courseId } })
      }, {
        title: 'Preview',
        icon: 'eye',
        action: () => window.open(this.previewUrl, '_blank')
      }];
      if (!this.isAdmin && !this.isCourseAdmin) return items;
      return items.concat({
        title: 'Publish',
        icon: 'upload',
        action: () => this.confirmPublishing()
      });
    },
    previewUrl() {
      if (!PREVIEW_URL) return;
      const { courseId, id } = this.activity;
      return format(PREVIEW_URL, { repositoryId: courseId, activityId: id });
    }
  },
  methods: mapActions({ publishActivity: 'publish' }, 'activities'),
  components: { ActivitySidebar, Discussion }
};
</script>

<style lang="scss" scoped>
.actions {
  padding-top: 105px;
}
</style>
