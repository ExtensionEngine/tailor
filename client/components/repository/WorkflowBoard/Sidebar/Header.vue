<template>
  <header>
    <h3>{{ task.name }}</h3>
    <div>
      <chip :id="task.shortId" />
      <v-btn
        v-clipboard:copy="task.shortId"
        v-clipboard:success="() => {
          $snackbar.show('ID copied to the clipboard', { immediate: true })
        }"
        v-clipboard:error="() => $snackbar.show('Not able to copy the ID')"
        class="ml-2"
        text
        small>
        <v-icon dense class="pr-2">mdi-identifier</v-icon>
        Copy id
      </v-btn>
      <v-btn
        v-clipboard:copy="taskUrl"
        v-clipboard:success="() => {
          $snackbar.show('Link copied to the clipboard', { immediate: true })
        }"
        v-clipboard:error="() => $snackbar.show('Not able to copy the link')"
        class="ml-2"
        text
        small>
        <v-icon class="pr-2">mdi-link</v-icon>
        Copy link
      </v-btn>
    </div>
    <v-btn @click="archive(task)" class="px-0 py-1 my-5" text small>
      <v-icon>mdi-package-down</v-icon> Archive
    </v-btn>
    <div class="my-1">Created at {{ task.createdAt | formatDate }}</div>
    <div class="my-1">Updated at {{ task.updatedAt | formatDate }}</div>
  </header>
</template>

<script>
import Chip from '../Chip';
import { mapActions } from 'vuex';

export default {
  props: {
    task: { type: Object, default: () => ({}) }
  },
  computed: {
    taskUrl: () => window.location.href
  },
  methods: mapActions('repository/tasks', ['archive']),
  components: { Chip }
};
</script>
