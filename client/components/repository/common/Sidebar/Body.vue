<template>
  <div class="body">
    <v-sheet color="transparent" class="d-flex align-center my-5 pa-1">
      <div class="d-flex body-2 font-weight-bold">
        <v-icon :color="config.color" size="21" class="mr-1">mdi-label</v-icon>
        <span>{{ config.label.toUpperCase() }}</span>
      </div>
      <v-divider vertical class="my-2 mx-3 grey darken-2" />
      <v-tooltip open-delay="500" bottom>
        <template v-slot:activator="{ on }">
          <label-chip v-on="on">{{ activity.shortId }}</label-chip>
        </template>
        {{ config.label }} ID
      </v-tooltip>
      <v-spacer />
      <v-btn
        v-clipboard:copy="activity.shortId"
        v-clipboard:success="() => {
          $snackbar.show('ID copied to the clipboard', { immediate: true })
        }"
        v-clipboard:error="() => $snackbar.show('Not able to copy the ID')"
        color="primary darken-4"
        text x-small
        class="mr-2 px-0">
        <v-icon small class="mr-1">mdi-content-copy</v-icon>
        <v-icon dense>mdi-identifier</v-icon>
      </v-btn>
      <v-btn
        v-clipboard:copy="activityUrl"
        v-clipboard:success="() => {
          $snackbar.show('Link copied to the clipboard', { immediate: true })
        }"
        v-clipboard:error="() => $snackbar.show('Not able to copy the link')"
        color="primary darken-4"
        text x-small
        class="px-0">
        <v-icon small class="mr-1">mdi-content-copy</v-icon>
        <v-icon dense>mdi-link</v-icon>
      </v-btn>
    </v-sheet>
    <activity-status
      v-if="activity.isTrackedInWorkflow"
      v-bind="activity"
      class="mt-6 mb-3" />
    <div class="meta-elements">
      <meta-input
        v-for="it in metadata"
        :key="`${activity.uid}.${it.key}`"
        @update="updateActivity"
        :meta="it" />
    </div>
    <div>
      <relationship
        v-for="relationship in config.relationships"
        :key="`${activity.uid}.${relationship.type}`"
        :activity="activity"
        v-bind="relationship" />
    </div>
    <activity-discussion :activity="activity" panel class="mt-2 mb-5 mx-1" />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import ActivityDiscussion from '../ActivityDiscussion.vue';
import ActivityStatus from './Status/index.vue';
import LabelChip from '@/components/repository/common/LabelChip.vue';
import MetaInput from '@/components/common/MetaInput.vue';
import Relationship from './Relationship.vue';

export default {
  name: 'activity-sidebar-body',
  inject: ['$schemaService'],
  props: {
    activity: { type: Object, required: true }
  },
  computed: {
    ...mapGetters(['isAdmin']),
    ...mapGetters('repository', ['isRepositoryAdmin']),
    activityUrl: () => window.location.href,
    config: vm => vm.$schemaService.getLevel(vm.activity.type),
    metadata: vm => vm.$schemaService.getActivityMetadata(vm.activity)
  },
  methods: {
    ...mapActions('repository/activities', ['update']),
    async updateActivity(key, value) {
      const data = { ...this.activity.data, [key]: value };
      await this.update({ uid: this.activity.uid, data });
      this.$snackbar.show(`${this.config.label} saved`);
    }
  },
  components: {
    ActivityStatus,
    ActivityDiscussion,
    Relationship,
    MetaInput,
    LabelChip
  }
};
</script>

<style lang="scss" scoped>
.body {
  position: relative;
  padding: 0.375rem 1rem;
}

.meta-elements {
  padding-top: 0.625rem;
}
</style>
