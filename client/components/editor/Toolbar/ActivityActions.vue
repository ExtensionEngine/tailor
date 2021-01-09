<template>
  <v-toolbar flat dense class="transparent">
    <v-list color="transparent" class="d-flex">
      <v-tooltip
        v-for="({ title, icon, action, active, disabled }) in actions"
        :key="title"
        color="blue-grey darken-3"
        bottom>
        <template v-slot:activator="{ on }">
          <v-btn
            v-on="on"
            @click.stop="action"
            :input-value="active"
            :disabled="disabled"
            active-class="pink darken-2"
            icon dark
            class="mr-2">
            <v-icon>mdi-{{ icon }}</v-icon>
          </v-btn>
        </template>
        <span>{{ title }}</span>
      </v-tooltip>
    </v-list>
  </v-toolbar>
</template>

<script>
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex';
import activityApi from '@/api/activity';
import publishMixin from 'components/common/mixins/publish';

export default {
  name: 'activity-actions',
  mixins: [publishMixin],
  computed: {
    ...mapState('editor', ['showPublishDiff']),
    ...mapGetters(['isAdmin']),
    ...mapGetters('editor', ['activity']),
    ...mapGetters('repository', ['isRepositoryAdmin']),
    actions() {
      const { $router } = this;
      const items = [{
        title: 'Back',
        icon: 'arrow-left',
        action: () => {
          return $router.push({
            name: 'repository',
            query: { activityId: this.activity.id }
          });
        }
      }, {
        title: 'Preview',
        icon: 'eye',
        action: () => this.preview()
      }, {
        title: 'View changes since publish',
        icon: 'file-eye-outline',
        active: this.showPublishDiff,
        disabled: !this.activity.publishedAt,
        action: () => this.togglePublishDiff()
      }];
      if (!this.isAdmin && !this.isRepositoryAdmin) return items;
      return items.concat({
        title: 'Publish',
        icon: 'upload',
        action: () => this.confirmPublishing()
      });
    }
  },
  methods: {
    ...mapMutations('editor', ['setShowPublishDiff']),
    ...mapActions('repository/activities', { publishActivity: 'publish' }),
    preview() {
      const { repositoryId, id } = this.activity;
      return activityApi.createPreview(repositoryId, id)
        .then(location => window.open(location));
    },
    togglePublishDiff() {
      this.setShowPublishDiff(!this.showPublishDiff);
    }
  }
};
</script>

<style lang="scss" scoped>
.v-toolbar ::v-deep .v-toolbar__content {
  padding: 0 0.5rem;
}
</style>
