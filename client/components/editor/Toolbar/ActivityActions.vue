<template>
  <v-toolbar flat dense class="transparent">
    <v-list color="transparent">
      <v-tooltip
        v-for="({ title, icon, action }) in actions"
        :key="title"
        color="blue-grey darken-3"
        bottom>
        <template v-slot:activator="{ on }">
          <v-btn
            v-on="on"
            @click.stop="action"
            color="grey lighten-3"
            icon
            class="mr-1">
            <v-icon>mdi-{{ icon }}</v-icon>
          </v-btn>
        </template>
        <span>{{ title }}</span>
      </v-tooltip>
    </v-list>
  </v-toolbar>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import activityApi from '@/api/activity';
import publishMixin from 'components/common/mixins/publish';

export default {
  name: 'activity-actions',
  mixins: [publishMixin],
  computed: {
    ...mapGetters(['isAdmin']),
    ...mapGetters('editor', ['activity']),
    ...mapGetters('repository', ['isRepositoryAdmin']),
    actions() {
      const { $router } = this;
      const items = [{
        title: 'Back',
        icon: 'arrow-left',
        action: () => $router.push({ name: 'repository' })
      }, {
        title: 'Preview',
        icon: 'eye',
        action: () => this.preview()
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
    ...mapActions('repository/activities', { publishActivity: 'publish' }),
    preview() {
      const { repositoryId, id } = this.activity;
      return activityApi.createPreview(repositoryId, id)
        .then(location => window.open(location));
    }
  }
};
</script>

<style lang="scss" scoped>
.v-toolbar ::v-deep .v-toolbar__content {
  padding: 0 0.5rem;
}
</style>
