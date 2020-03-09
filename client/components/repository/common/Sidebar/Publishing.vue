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
        :color="hasChanges ? 'orange' : 'green'"
        :tooltip="{ bottom: true, maxWidth: 300 }">
        {{ publishingInfo }}
      </publishing-badge>
      <span class="pl-1">
        {{ isPublishing ? publishStatus.message : publishedAtMessage }}
      </span>
    </div>
  </span>
</template>

<script>
import api from '@/api/revision';
import fecha from 'fecha';
import get from 'lodash/get';
import { getDescendants } from 'utils/activity';
import { getLevel } from 'shared/activities';
import { mapActions } from 'vuex';
import PublishingBadge from 'components/common/PublishingBadge';
import publishMixin from 'components/common/mixins/publish';
import uniq from 'lodash/uniq';

const getRevisionParams = id => ({
  offset: 0,
  limit: 25,
  entityId: id,
  descendants: true
});

const isAfter = (a, b) => new Date(a) > new Date(b);
const concat = arr => arr.join(', ').replace(/, ([^,]*)$/, ' and $1');

const getPublishingInfo = ({ hasChanges, users }) => {
  if (!hasChanges) return 'Activity content is published';
  return users
    ? `This activity has unpublished changes made by ${users}`
    : 'This activity has unpublished changes';
};

export default {
  mixins: [publishMixin],
  props: {
    activity: { type: Object, required: true },
    outlineActivities: { type: Array, required: true }
  },
  data: () => ({ revisions: [] }),
  computed: {
    config: vm => getLevel(vm.activity.type),
    hasChanges: vm => vm.activity.hasChanges,
    publishingInfo: vm => getPublishingInfo(vm),
    publishedAtMessage() {
      const { publishedAt } = this.activity;
      return publishedAt
        ? `Published on ${fecha.format(new Date(publishedAt), 'M/D/YY HH:mm')}`
        : 'Not published';
    },
    users() {
      const { revisions, activity: { publishedAt } } = this;
      const users = revisions
        .filter(it => isAfter(it.createdAt, publishedAt))
        .map(revision => get(revision, 'user.fullName'));
      return concat(uniq(users).slice(0, 3));
    },
    activityWithDescendants({ outlineActivities, activity } = this) {
      return [...getDescendants(outlineActivities, activity), activity];
    }
  },
  methods: mapActions('repository/activities', { publishActivity: 'publish' }),
  created() {
    const { id: activityId, repositoryId } = this.activity;
    const params = getRevisionParams(activityId);
    return api.fetch(repositoryId, params)
      .then(revisions => (this.revisions = revisions));
  },
  components: { PublishingBadge }
};
</script>

<style lang="scss" scoped>
.publish-status {
  display: flex;
  align-items: center;
  padding: 1.125rem 0.375rem 0 0.375rem;
}
</style>
