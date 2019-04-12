<template>
  <div class="publish-container">
    <div class="publish-date">
      <span>{{ publishedAtMessage }}</span>
    </div>
    <v-menu lazy offset-y left>
      <template v-slot:activator="{ on }">
        <v-btn
          :loading="isPublishing"
          v-on="on"
          color="blue-grey"
          outline
          small>
          Publish
        </v-btn>
      </template>
      <v-list>
        <v-list-tile @click="confirmPublishing()">
          <v-list-tile-title>{{ activityLabel }}</v-list-tile-title>
        </v-list-tile>
        <v-list-tile @click="confirmPublishing(activityWithDescendants)">
          <v-list-tile-title>{{ activityLabel }} and children</v-list-tile-title>
        </v-list-tile>
        <v-list-tile @click="confirmPublishing(outlineActivities)">
          <v-list-tile-title>All</v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-menu>
    <div class="publish-status">
      <span>{{ publishStatus }}</span>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex-module';
import fecha from 'fecha';
import { getDescendants } from 'utils/activity';
import { getLevel } from 'shared/activities';
import publishMixin from 'components/common/mixins/publish';

export default {
  mixins: [publishMixin],
  computed: {
    ...mapGetters(['activity', 'outlineActivities'], 'course'),
    activityLabel() {
      return getLevel(this.activity.type).label;
    },
    publishedAtMessage() {
      const { publishedAt } = this.activity;
      return publishedAt
        ? `Published on ${fecha.format(new Date(publishedAt), 'M/D/YY HH:mm')}`
        : 'Not published';
    },
    activityWithDescendants({ activity, outlineActivities } = this) {
      return [...getDescendants(outlineActivities, activity), activity];
    }
  },
  methods: mapActions({ publishActivity: 'publish' }, 'activities')
};
</script>

<style lang="scss" scoped>
.publish-container {
  min-height: 70px;
  padding: 0 7px;

  .publish-date {
    width: 180px;
    line-height: 44px;
  }

  .v-btn {
    position: absolute;
    top: 10px;
    right: 24px;
  }
}
</style>
