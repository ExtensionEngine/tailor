<template>
  <div class="publish-container">
    <div class="publish-date">
      <span>{{ publishedAtMessage }}</span>
    </div>
    <v-menu offset-y>
      <template v-slot:activator="{ on }">
        <v-btn
          :loading="isPublishing"
          :disabled="isPublishing"
          v-on="on"
          color="blue-grey"
          outline
          small>
          Publish
        </v-btn>
      </template>
      <v-list>
        <v-list-tile @click="confirmPublishing()">
          <v-list-tile-title>Publish element</v-list-tile-title>
        </v-list-tile>
        <v-list-tile @click="confirmPublishing(activityWithDescendants)">
          <v-list-tile-title>Publish descendants</v-list-tile-title>
        </v-list-tile>
        <v-list-tile @click="confirmPublishing(outlineActivities)">
          <v-list-tile-title>Publish all</v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-menu>
    <div class="publish-status">
      <span>{{ publishStatus }}</span>
    </div>
  </div>
</template>

<script>
import publishMixin from 'components/common/mixins/publish';
import fecha from 'fecha';
import { getDescendants } from 'utils/activity';
import { mapGetters, mapActions } from 'vuex-module';

export default {
  mixins: [publishMixin],
  computed: {
    ...mapGetters([
      'activity',
      'outlineActivities'
    ], 'course'),
    publishedAtMessage() {
      let { publishedAt } = this.activity;
      return publishedAt
        ? `Published on ${fecha.format(new Date(publishedAt), 'M/D/YY HH:mm')}`
        : 'Not published';
    },
    activityWithDescendants({ activity, outlineActivities } = this) {
      return [...getDescendants(outlineActivities, activity), activity];
    }
  },
  methods: {
    ...mapActions({ publishActivity: 'publish' }, 'activities')
  }
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
