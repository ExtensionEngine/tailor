<template>
  <span class="publish-container">
    <v-menu offset-y left>
      <template v-slot:activator="{ on }">
        <v-btn
          v-on="on"
          :loading="isPublishing"
          color="primary darken-1"
          text
          class="px-1">
          <v-icon class="pr-1">mdi-publish</v-icon>Publish
        </v-btn>
      </template>
      <v-list dense class="text-left">
        <v-list-item @click="confirmPublishing()">
          <v-list-item-title>{{ config.label }}</v-list-item-title>
        </v-list-item>
        <v-list-item
          v-if="activityWithDescendants.length > 1"
          @click="confirmPublishing(activityWithDescendants)">
          <v-list-item-title>{{ config.label }} and children</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
    <div class="publish-status">
      <publishing-badge
        :has-changes="hasUnpublishedChanges"
        :activity="activity" />
      <span class="pl-1">
        {{ isPublishing ? publishStatus.message : publishedAtMessage }}
      </span>
    </div>
  </span>
</template>

<script>
import fecha from 'fecha';
import { getDescendants } from 'utils/activity';
import { getLevel } from 'shared/activities';
import { mapActions } from 'vuex';
import PublishingBadge from 'components/common/PublishingBadge';
import publishMixin from 'components/common/mixins/publish';

export default {
  mixins: [publishMixin],
  props: {
    activity: { type: Object, required: true },
    outlineActivities: { type: Array, required: true }
  },
  data: () => ({ revisions: [] }),
  computed: {
    config: vm => getLevel(vm.activity.type),
    publishedAtMessage() {
      const { publishedAt } = this.activity;
      return publishedAt
        ? `Published on ${fecha.format(new Date(publishedAt), 'M/D/YY HH:mm')}`
        : 'Not published';
    },
    hasUnpublishedChanges() {
      const { modifiedAt, publishedAt } = this.activity;
      return new Date(modifiedAt) > new Date(publishedAt);
    },
    activityWithDescendants({ outlineActivities, activity } = this) {
      return [...getDescendants(outlineActivities, activity), activity];
    }
  },
  methods: mapActions('repository/activities', { publishActivity: 'publish' }),
  components: { PublishingBadge }
};
</script>

<style lang="scss" scoped>
.publish-status {
  display: flex;
  align-items: center;
  padding: 1.125rem 0.375rem 0 0.25rem;
}
</style>
