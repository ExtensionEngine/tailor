<template>
  <v-navigation-drawer
    permanent absolute
    width="420">
    <v-row no-gutters class="fill-height">
      <v-navigation-drawer
        top="55"
        mini-variant-width="60"
        mini-variant absolute permanent stateless
        class="blue-grey lighten-4 actions">
        <v-toolbar flat height="fit-content" class="transparent pa-1">
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
                  icon text>
                  <v-icon>mdi-{{ icon }}</v-icon>
                </v-btn>
              </template>
              <span>{{ title }}</span>
            </v-tooltip>
          </v-list>
        </v-toolbar>
      </v-navigation-drawer>
      <div class="structure-navigation grow">
        <v-text-field
          v-model="search"
          label="Search by name..."
          clear-icon="mdi-close"
          clearable hide-details
          class="my-2 mx-3" />
        <v-treeview
          @update:active="navigateTo"
          :items="repositoryTree"
          :search="search"
          transition dense activatable hoverable />
      </div>
    </v-row>
  </v-navigation-drawer>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import api from '@/api/activity';
import publishMixin from 'components/common/mixins/publish';
import { toTreeFormat } from 'utils/activity';

export default {
  mixins: [publishMixin],
  props: {
    activity: { type: Object, required: true },
    focusedElement: { type: Object, default: null }
  },
  data: () => ({ search: '' }),
  computed: {
    ...mapGetters(['isAdmin']),
    ...mapGetters('repository', ['outlineActivities', 'isRepositoryAdmin']),
    actions() {
      const { $router, activity: { repositoryId } } = this;
      const items = [{
        title: 'Preview',
        icon: 'eye',
        action: () => this.previewContainer()
      }, {
        title: 'Back',
        icon: 'arrow-left',
        action: () => $router.push({ name: 'repository', params: { repositoryId } })
      }];
      if (!this.isAdmin && !this.isRepositoryAdmin) return items;
      return [{
        title: 'Publish',
        icon: 'upload',
        action: () => this.confirmPublishing()
      }].concat(items);
    },
    repositoryTree: vm => toTreeFormat(vm.outlineActivities, [])
  },
  methods: {
    ...mapActions('repository/activities', { publishActivity: 'publish' }),
    previewContainer() {
      const { repositoryId, id } = this.activity;
      return api.createPreview(repositoryId, id)
        .then(location => window.open(location));
    },
    navigateTo([activityId]) {
      if (this.activity.id === activityId) return;
      this.$router.push({ name: 'editor', params: { activityId } });
    }
  }
};
</script>

<style lang="scss" scoped>
.actions {
  position: fixed;
  padding-top: 6.5rem;
}

::v-deep .v-toolbar__content {
  padding: 0;

  .v-btn.v-btn--icon.v-size--default {
    width: 2.25rem;
    height: 2.25rem;
    margin: 0.375rem;
  }
}

.structure-navigation {
  padding: 3.75rem 0 0 4rem;
  text-align: left;

  ::v-deep {
    .v-treeview-node__content {
      cursor: pointer;
    }
  }
}
</style>
