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
      <v-list>
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
import { mapActions, mapGetters } from 'vuex';
import api from '@/api/activity';
import publishMixin from 'components/common/mixins/publish';

export default {
  mixins: [publishMixin],
  props: {
    activity: { type: Object, required: true },
    focusedElement: { type: Object, default: null }
  },
  computed: {
    ...mapGetters(['isAdmin']),
    ...mapGetters('course', ['outlineActivities', 'isCourseAdmin']),
    actions() {
      const { $router, activity: { repositoryId } } = this;
      const items = [{
        title: 'Preview',
        icon: 'eye',
        action: () => this.previewContainer()
      }, {
        title: 'Back',
        icon: 'arrow-left',
        action: () => $router.push({ name: 'course', params: { courseId: repositoryId } })
      }];
      if (!this.isAdmin && !this.isCourseAdmin) return items;
      return [{
        title: 'Publish',
        icon: 'upload',
        action: () => this.confirmPublishing()
      }].concat(items);
    }
  },
  methods: {
    ...mapActions('activities', { publishActivity: 'publish' }),
    previewContainer() {
      const { courseId, id } = this.activity;
      return api.createPreview(courseId, id)
        .then(location => window.open(location));
    }
  }
};
</script>

<style lang="scss" scoped>
.actions {
  padding-top: 60px;
}
</style>
