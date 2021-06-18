<template>
  <header>
    <div class="mt-5">
      <h5 class="h5">
        Related <span class="text-lowercase">{{ activityConfig.label }}</span>
      </h5>
      <activity-card
        v-bind="{ ...activity, name: activity.data.name }"
        :type-label="activityConfig.label"
        :color="activityConfig.color" />
    </div>
    <publishing
      v-if="isAdmin || isRepositoryAdmin"
      :activity="activity"
      :outline-activities="outlineActivities"
      hide-publish />
    <div class="mt-8">
      <v-tooltip open-delay="500" bottom>
        <template #activator="{ on }">
          <label-chip v-on="on">{{ activity.shortId }}</label-chip>
        </template>
        {{ activityConfig.label }} ID
      </v-tooltip>
      <v-btn
        v-clipboard:copy="activity.shortId"
        v-clipboard:success="() => {
          $snackbar.show('ID copied to the clipboard', { immediate: true })
        }"
        v-clipboard:error="() => $snackbar.show('Not able to copy the ID')"
        color="primary darken-3"
        text small
        class="ml-2 px-1">
        <v-icon dense class="pr-2">mdi-identifier</v-icon>
        Copy id
      </v-btn>
      <v-btn
        v-clipboard:copy="statusUrl"
        v-clipboard:success="() => {
          $snackbar.show('Link copied to the clipboard', { immediate: true })
        }"
        v-clipboard:error="() => $snackbar.show('Not able to copy the link')"
        color="primary darken-3"
        text small
        class="ml-2 px-1">
        <v-icon class="pr-2">mdi-link</v-icon>
        Copy link
      </v-btn>
      <div class="mt-1 caption grey--text text--darken-1">
        Created at {{ activity.createdAt | formatDate }}
        <template v-if="isUpdated">
          <span class="mx-1">|</span>
          Updated at {{ activity.status.updatedAt | formatDate }}
        </template>
      </div>
    </div>
  </header>
</template>

<script>
import ActivityCard from './ActivityCard';
import fecha from 'fecha';
import { getLevel } from 'shared/activities';
import isBefore from 'date-fns/isBefore';
import LabelChip from '@/components/repository/common/LabelChip';
import { mapGetters } from 'vuex';
import Publishing from '@/components/repository/common/Sidebar/Publishing';

export default {
  props: {
    activity: { type: Object, required: true }
  },
  computed: {
    ...mapGetters(['isAdmin']),
    ...mapGetters('repository', ['structure', 'outlineActivities', 'isRepositoryAdmin']),
    activityConfig: ({ activity }) => getLevel(activity.type),
    isUpdated() {
      const { activity } = this;
      if (!activity.status.updatedAt) return false;
      const createdAt = this.truncateSeconds(new Date(activity.createdAt));
      const updatedAt = this.truncateSeconds(new Date(activity.status.updatedAt));
      return isBefore(createdAt, updatedAt);
    },
    statusUrl: () => window.location.href
  },
  methods: {
    truncateSeconds(date) {
      const format = 'MM/DD/YY HH:mm';
      return fecha.parse(fecha.format(date, format), format);
    }
  },
  components: { ActivityCard, LabelChip, Publishing }
};
</script>
