<template>
  <span class="publish-container">
    <v-menu offset-y left>
      <template v-slot:activator="{ on }">
        <v-btn
          v-on="on"
          :loading="isPublishing"
          color="grey darken-3"
          text
          class="px-1">
          <v-icon class="mr-2">mdi-cloud-upload-outline</v-icon>Publish
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
      <publishing-badge :activity="activity" />
      <span class="pl-1">
        {{ isPublishing ? publishStatus.message : publishedAtMessage }}
      </span>
    </div>
  </span>
</template>

<script>
import { activity as activityUtils } from '@tailor-cms/utils';
import fecha from 'fecha';
import { mapActions } from 'vuex';
import PublishingBadge from './Badge.vue';
import publishMixin from 'components/common/mixins/publish.vue';

const { getDescendants } = activityUtils;

export default {
  inject: ['$schemaService'],
  mixins: [publishMixin],
  props: {
    activity: { type: Object, required: true },
    outlineActivities: { type: Array, required: true }
  },
  computed: {
    config: vm => vm.$schemaService.getLevel(vm.activity.type),
    publishedAtMessage() {
      const { publishedAt } = this.activity;
      return publishedAt
        ? `Published on ${fecha.format(new Date(publishedAt), 'M/D/YY h:mm A')}`
        : 'Not published';
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
