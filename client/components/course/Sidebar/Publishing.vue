<template>
  <div :key="activity._cid" class="publish-container">
    <div class="publish-date">
      <span>{{ publishedAtMessage }}</span>
    </div>
    <v-menu offset-y left>
      <template v-slot:activator="{ on }">
        <v-btn
          v-on="on"
          :loading="isPublishing"
          color="blue-grey darken-1"
          outlined
          small>
          Publish
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
      <span>{{ publishStatus.message }}</span>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import fecha from 'fecha';
import { getDescendants } from 'utils/activity';
import { getLevel } from 'shared/activities';
import publishMixin from 'components/common/mixins/publish';

export default {
  mixins: [publishMixin],
  computed: {
    ...mapGetters('course', ['activity', 'outlineActivities']),
    config() {
      return getLevel(this.activity.type);
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
  methods: mapActions('activities', { publishActivity: 'publish' })
};
</script>

<style lang="scss" scoped>
.publish-container {
  min-height: 70px;
  padding: 0 7px;

  .publish-date {
    width: 200px;
    line-height: 44px;
  }

  .v-btn {
    position: absolute;
    top: 10px;
    right: 24px;
  }
}
</style>
