<template>
  <header>
    <h3>{{ name }}</h3>
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
        class="ml-2 px-1"
        text small>
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
        class="ml-2 px-1"
        text small>
        <v-icon class="pr-2">mdi-link</v-icon>
        Copy link
      </v-btn>
      <v-btn
        @click="requestArchiveConfirmation"
        class="ml-2 px-1"
        color="blue-grey darken-3"
        text small>
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
import EventBus from 'EventBus';
import LabelChip from '@/components/repository/common/LabelChip';
import { mapActions } from 'vuex';

const appChannel = EventBus.channel('app');

export default {
  props: {
    cid: { type: String, required: true },
    id: { type: Number, required: true },
    name: { type: String, required: true },
    shortId: { type: String, required: true },
    createdAt: { type: String, required: true },
    updatedAt: { type: String, required: true }
  },
  computed: {
    taskUrl: () => window.location.href
  },
  methods: {
    ...mapActions('repository/tasks', ['archive']),
    requestArchiveConfirmation() {
      const model = { id: this.id, _cid: this.cid };
      appChannel.emit('showConfirmationModal', {
        title: 'Archive task?',
        message: 'Are you sure you want to archive task?',
        action: () => this.archive(model)
      });
    }
  },
  components: { LabelChip }
};
</script>
