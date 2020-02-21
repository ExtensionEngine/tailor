<template>
  <span :key="activity._cid" class="publish-container">
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
      <v-list class="text-left">
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
      <div class="badge-wrapper">
        <v-progress-circular
          v-if="loading"
          :size="20"
          color="primary"
          indeterminate />
        <publishing-badge
          v-else
          :color="hasChanges ? 'orange' : 'green'"
          :tooltip="{ bottom: true, maxWidth: 300 }">
          {{ publishingInfo }}
        </publishing-badge>
      </div>
      <span>
        {{ isPublishing ? publishStatus.message : publishedAtMessage }}
      </span>
    </div>
  </span>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import api from '@/api/revision';
import fecha from 'fecha';
import get from 'lodash/get';
import { getDescendants } from 'utils/activity';
import { getLevel } from 'shared/activities';
import Promise from 'bluebird';
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
  data: () => ({
    revisions: [],
    loading: true
  }),
  computed: {
    ...mapGetters('repository', ['activity', 'outlineActivities']),
    config: vm => getLevel(vm.activity.type),
    publishingInfo: vm => getPublishingInfo(vm),
    publishedAtMessage() {
      const { publishedAt } = this.activity;
      return publishedAt
        ? `Published on ${fecha.format(new Date(publishedAt), 'M/D/YY HH:mm')}`
        : 'Not published';
    },
    hasChanges() {
      const { modifiedAt, publishedAt } = this.activity;
      if (!modifiedAt || !publishedAt) return true;
      return isAfter(modifiedAt, publishedAt);
    },
    users() {
      const { revisions, activity: { publishedAt } } = this;
      const users = revisions
        .filter(it => isAfter(it.createdAt, publishedAt))
        .map(revision => get(revision, 'user.fullName'));
      return concat(uniq(users).slice(0, 3));
    },
    activityWithDescendants({ activity, outlineActivities } = this) {
      return [...getDescendants(outlineActivities, activity), activity];
    }
  },
  methods: mapActions('activities', { publishActivity: 'publish' }),
  created() {
    const { id: activityId, repositoryId } = this.activity;
    const params = getRevisionParams(activityId);
    const getRevisions = api.fetch(repositoryId, params);
    return Promise.join(getRevisions, Promise.delay(500))
      .spread(revisions => (this.revisions = revisions))
      .finally(() => (this.loading = false));
  },
  components: { PublishingBadge }
};
</script>

<style lang="scss" scoped>
.publish-status {
  display: flex;
  align-items: center;
  padding: 1.125rem 0.375rem 0 0.375rem;

  .badge-wrapper {
    width: 25px;
  }
}
</style>
