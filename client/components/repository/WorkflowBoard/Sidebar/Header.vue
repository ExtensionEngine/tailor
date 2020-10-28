<template>
  <header>
    <div class="mt-5">
      <h5 class="h5">
        Related <span class="text-lowercase">{{ config.label }}</span>
      </h5>
      <activity-card
        v-bind="activity"
        :name="activityName"
        :type="config.label"
        :color="config.color" />
    </div>
    <div class="mt-8">
      <v-tooltip open-delay="500" bottom>
        <template #activator="{ on }">
          <label-chip v-on="on">{{ shortId }}</label-chip>
        </template>
        Task ID
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
        v-clipboard:copy="taskUrl"
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
      <v-btn
        @click="requestArchiveConfirmation"
        color="blue-grey darken-3"
        text small
        class="ml-2 px-1">
        <v-icon class="pr-2">mdi-package-down</v-icon> Archive
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
import { mapActions, mapGetters } from 'vuex';
import ActivityCard from './ActivityCard';
import find from 'lodash/find';
import LabelChip from '@/components/repository/common/LabelChip';
import { mapRequests } from '@/plugins/radio';

export default {
  props: {
    uid: { type: String, required: true },
    id: { type: Number, required: true },
    shortId: { type: String, required: true },
    activity: { type: Object, required: true },
    createdAt: { type: String, required: true },
    updatedAt: { type: String, required: true }
  },
  computed: {
    ...mapGetters('repository', ['structure']),
    config: vm => find(vm.structure, { type: vm.activity.type }),
    taskUrl: () => window.location.href,
    activityName: vm => vm.activity.data.name
  },
  methods: {
    ...mapActions('repository/tasks', ['archive']),
    ...mapRequests('app', ['showConfirmationModal']),
    requestArchiveConfirmation() {
      const model = { id: this.id, uid: this.uid };
      this.showConfirmationModal({
        title: 'Archive task?',
        message: 'Are you sure you want to archive task?',
        action: () => this.archive(model)
      });
    }
  },
  components: { ActivityCard, LabelChip }
};
</script>
