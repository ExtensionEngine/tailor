<template>
  <header>
    <div class="mt-5">
      <h5 class="h5">
        Related <span class="text-lowercase">{{ activityConfig.label }}</span>
      </h5>
      <activity-card
        v-bind="{ id, name, shortId }"
        :type-label="activityConfig.label"
        :color="activityConfig.color" />
    </div>
    <div class="mt-8">
      <v-tooltip open-delay="500" bottom>
        <template #activator="{ on }">
          <label-chip v-on="on">{{ shortId }}</label-chip>
        </template>
        {{ activityConfig.label }} ID
      </v-tooltip>
      <v-btn
        v-clipboard:copy="shortId"
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
        Created at {{ createdAt | formatDate }}
        <template v-if="isUpdated">
          <span class="mx-1">|</span>
          Updated at {{ updatedAt | formatDate }}
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

export default {
  props: {
    uid: { type: String, required: true },
    id: { type: Number, required: true },
    shortId: { type: String, required: true },
    name: { type: String, required: true },
    type: { type: String, required: true },
    createdAt: { type: String, required: true },
    updatedAt: { type: String, default: null }
  },
  computed: {
    ...mapGetters('repository', ['structure']),
    activityConfig: vm => getLevel(vm.type),
    isUpdated() {
      if (!this.updatedAt) return false;
      const createdAt = this.truncateSeconds(new Date(this.createdAt));
      const updatedAt = this.truncateSeconds(new Date(this.updatedAt));
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
  components: { ActivityCard, LabelChip }
};
</script>
