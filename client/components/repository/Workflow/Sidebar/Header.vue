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
        Activity ID
      </v-tooltip>
      <v-btn
        v-clipboard:copy="shortId"
        v-clipboard:success="() => {
          $snackbar.show('ID copied to the clipboard', { immediate: true })
        }"
        v-clipboard:error="() => $snackbar.show('Not able to copy the ID')"
        color="blue-grey darken-3"
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
        color="blue-grey darken-3"
        text small
        class="ml-2 px-1">
        <v-icon class="pr-2">mdi-link</v-icon>
        Copy link
      </v-btn>
      <div class="mt-1 caption grey--text text--darken-1">
        Created at {{ createdAt | formatDate }}
        <span class="mx-1">|</span>
        Updated at {{ updatedAt | formatDate }}
      </div>
    </div>
  </header>
</template>

<script>
import ActivityCard from './ActivityCard';
import find from 'lodash/find';
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
    updatedAt: { type: String, required: true }
  },
  computed: {
    ...mapGetters('repository', ['structure']),
    activityConfig: vm => find(vm.structure, { type: vm.type }),
    statusUrl: () => window.location.href
  },
  components: { ActivityCard, LabelChip }
};
</script>
