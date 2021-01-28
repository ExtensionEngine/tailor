<template>
  <div class="body">
    <v-chip
      :color="config.color"
      label dark small
      class="readonly body-label">
      {{ config.label.toUpperCase() }}
    </v-chip>
    <v-tooltip open-delay="500" bottom>
      <template v-slot:activator="{ on }">
        <label-chip v-on="on" class="body-label">
          {{ activity.shortId }}
        </label-chip>
      </template>
      {{ config.label }} ID
    </v-tooltip>
    <div class="mt-1 mb-2">
      <v-btn
        v-clipboard:copy="activity.shortId"
        v-clipboard:success="() => {
          $snackbar.show('ID copied to the clipboard', { immediate: true })
        }"
        v-clipboard:error="() => $snackbar.show('Not able to copy the ID')"
        color="blue-grey darken-3"
        text small
        class="px-1 mr-2">
        <v-icon dense class="pr-2">mdi-identifier</v-icon>
        Copy id
      </v-btn>
      <v-btn
        v-clipboard:copy="activityUrl"
        v-clipboard:success="() => {
          $snackbar.show('Link copied to the clipboard', { immediate: true })
        }"
        v-clipboard:error="() => $snackbar.show('Not able to copy the link')"
        color="blue-grey darken-3"
        text small
        class="px-1">
        <v-icon class="pr-2">mdi-link</v-icon>
        Copy link
      </v-btn>
    </div>
    <div class="meta-elements">
      <meta-input
        v-for="it in metadata"
        :key="`${activity.uid}.${it.key}`"
        @update="updateActivity"
        :meta="it" />
    </div>
    <activity-status
      v-if="config.isTrackedInWorkflow"
      v-bind="activity"
      :name="activity.data.name"
      class="mb-12" />
    <div>
      <relationship
        v-for="relationship in config.relationships"
        :key="`${activity.uid}.${relationship.type}`"
        :activity="activity"
        v-bind="relationship" />
    </div>
    <activity-discussion :activity="activity" show-heading />
  </div>
</template>

<script>
import { getActivityMetadata, getLevel } from 'shared/activities';
import { mapActions, mapGetters } from 'vuex';
import ActivityDiscussion from '../ActivityDiscussion';
import ActivityStatus from './Status';
import LabelChip from '@/components/repository/common/LabelChip';
import MetaInput from 'tce-core/MetaInput';
import Relationship from './Relationship';

export default {
  name: 'activity-sidebar-body',
  props: {
    activity: { type: Object, required: true }
  },
  computed: {
    ...mapGetters(['isAdmin']),
    ...mapGetters('repository', ['isRepositoryAdmin']),
    activityUrl: () => window.location.href,
    config: vm => getLevel(vm.activity.type),
    metadata: vm => getActivityMetadata(vm.activity)
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

.body-label {
  margin: 0.25rem 0.25rem 1.25rem;
  font-weight: 500;
}

.meta-elements {
  padding-top: 0.625rem;
}
</style>
