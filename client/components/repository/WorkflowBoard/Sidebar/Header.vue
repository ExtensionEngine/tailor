<template>
  <header>
    <h3>{{ task.name }}</h3>
    <div class="mt-8">
      <v-tooltip open-delay="500" bottom>
        <template #activator="{ on }">
          <label-chip v-on="on">{{ task.shortId }}</label-chip>
        </template>
        Task ID
      </v-tooltip>
      <v-btn
        v-clipboard:copy="task.shortId"
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
    </div>
  </header>
</template>

<script>
import LabelChip from '@/components/repository/common/LabelChip';

export default {
  props: {
    task: { type: Object, default: () => ({}) }
  },
  computed: {
    taskUrl: () => window.location.href
  },
  components: { LabelChip }
};
</script>
