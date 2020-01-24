<template>
  <span :key="activity._cid" class="publish-container">
    <v-menu offset-y left>
      <template v-slot:activator="{ on }">
        <v-btn
          v-on="on"
          :loading="isPublishing"
          color="primary darken-1"
          text
          class="px-2">
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
    <div class="pl-2 mt-6 mb-2">
      {{ isPublishing ? publishStatus.message : publishedAtMessage }}
    </div>
  </span>
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
    config: vm => getLevel(vm.activity.type),
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
}
</style>
