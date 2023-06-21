<template>
  <span class="publish-container">
    <v-menu v-if="!hidePublish" offset-y left>
      <template #activator="{ on }">
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
    <div :class="{ 'mt-4': !hideDetails }" class="d-flex align-center">
      <v-tooltip open-delay="100" max-width="300" left>
        <template v-slot:activator="{ on }">
          <span v-on="on">
            <v-badge :color="badgeColor" inline dot />
            <span v-if="!hideDetails" class="ml-1">
              {{ isPublishing ? publishStatus.message : publishDetails }}
            </span>
          </span>
        </template>
        <span class="pl-1">
          {{ publishedAtMessage }}
        </span>
      </v-tooltip>
    </div>
  </span>
</template>

<script>
import { getDescendants, getLabel, isChanged } from '@/utils/activity';
import { activity as activityUtils } from '@tailor-cms/utils';
import countBy from 'lodash/countBy';
import fecha from 'fecha';
import filter from 'lodash/filter';o
import map from 'lodash/map';
import { mapActions } from 'vuex';
import pluralize from 'pluralize';
import publishMixin from 'components/common/mixins/publish';

const getDescriptor = (count, type) => `${count} ${pluralize(type, count)}`;
const arrayToSentence = arr => arr.join(', ').replace(/, ([^,]*)$/, ' and $1');
const getActivityInfo = hasChanges => hasChanges ? 'Has unpublished changes' : 'Published';
const getDescendantsInfo = (descendants, count, label) => {
  return `${descendants} within this ${label} ${pluralize('has', count)}
    unpublished changes.`;
};

const { getDescendants } = activityUtils;

export default {
  name: 'activity-publishing',
  inject: ['$schemaService'],
  mixins: [publishMixin],
  props: {
    activity: { type: Object, required: true },
    outlineActivities: { type: Array, required: true },
    hideDetails: { type: Boolean, default: false },
    hidePublish: { type: Boolean, default: false }
  },
  computed: {
    config: vm => vm.$schemaService.getLevel(vm.activity.type),
    publishedAtMessage() {
      const { publishedAt } = this.activity;
      return publishedAt
        ? `Published on ${fecha.format(new Date(publishedAt), 'M/D/YY h:mm A')}`
        : 'Not published';
    },
    publishDetails() {
      const {
        activity: { publishedAt },
        activityInfo,
        descendantsInfo,
        subtreeHasChanges
      } = this;

      if (!publishedAt) return 'Not published';
      if (subtreeHasChanges) return descendantsInfo;
      return activityInfo;
    },
    activityWithDescendants({ outlineActivities, activity } = this) {
      return [...getDescendants(outlineActivities, activity), activity];
    },
    label() {
      return getLabel(this.activity);
    },
    hasChanges() {
      return isChanged(this.activity);
    },
    changedDescendants() {
      return filter(getDescendants(this.outlineActivities, this.activity), isChanged);
    },
    subtreeHasChanges() {
      return !!this.changedDescendants.length;
    },
    activityInfo() {
      return getActivityInfo(this.hasChanges);
    },
    descendantsInfo() {
      const { changedDescendants, label } = this;
      const labelCountMap = countBy(changedDescendants, getLabel);
      const descendants = arrayToSentence(map(labelCountMap, getDescriptor));
      return getDescendantsInfo(descendants, changedDescendants.length, label);
    },
    badgeColor() {
      return this.hasChanges || this.subtreeHasChanges ? 'orange' : 'green';
    }
  },
  methods: mapActions('repository/activities', { publishActivity: 'publish' })
};
</script>
