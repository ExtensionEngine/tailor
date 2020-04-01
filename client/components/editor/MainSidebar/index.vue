<template>
  <v-navigation-drawer width="400" permanent absolute>
    <v-row no-gutters class="fill-height">
      <div class="sidebar-container grow">
        <element-sidebar
          v-if="focusedElement && !metadata.isEmpty"
          :key="focusedElement._cid"
          :element="focusedElement"
          :metadata="metadata" />
        <div
          :class="{ 'toolbar-visible': focusedElement && metadata.isEmpty }"
          class="pt-2 mx-4">
          <h4 class="body-1 ma-1">Navigation</h4>
          <v-text-field
            v-model="search"
            label="Search by name..."
            clear-icon="mdi-close"
            clearable hide-details
            class="mb-2 mx-1" />
          <v-treeview
            @update:active="navigateTo"
            :items="repositoryTree"
            :search="search"
            dense activatable hoverable
            open-all />
        </div>
      </div>
    </v-row>
  </v-navigation-drawer>
</template>

<script>
import ElementSidebar from '../ElementSidebar';
import get from 'lodash/get';
import { getElementMetadata } from 'shared/activities';
import { mapGetters } from 'vuex';
import { toTreeFormat } from 'utils/activity';

export default {
  props: {
    activity: { type: Object, required: true },
    focusedElement: { type: Object, default: null }
  },
  data: () => ({ search: '' }),
  computed: {
    ...mapGetters('repository', ['repository', 'outlineActivities']),
    repositoryTree: vm => toTreeFormat(vm.outlineActivities, []),
    metadata() {
      const { repository, focusedElement } = this;
      return getElementMetadata(get(repository, 'schema'), focusedElement);
    }
  },
  methods: {
    navigateTo([activityId]) {
      if (this.activity.id === activityId) return;
      this.$router.push({ name: 'editor', params: { activityId } });
    }
  },
  components: { ElementSidebar }
};
</script>

<style lang="scss" scoped>
.sidebar-container {
  padding: 3.75rem 0 0;
  text-align: left;

  ::v-deep {
    .v-treeview-node__content {
      cursor: pointer;
    }
  }
}

.toolbar-visible {
  margin-top: 3.5rem;
}
</style>
