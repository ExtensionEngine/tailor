<template>
  <v-tooltip open-delay="800" max-width="300" left>
    <template v-slot:activator="{ on }">
      <span v-on="on">
        <v-badge :color="badgeColor" inline dot />
      </span>
    </template>
    <span v-if="subtreeHasChanges">
      {{ descendantsInfo }}
    </span>
    <span v-else>{{ activityInfo }}</span>
  </v-tooltip>
</template>

<script>
import { getDescendants, getLabel, isChanged } from 'client/utils/activity';
import countBy from 'lodash/countBy';
import filter from 'lodash/filter';
import map from 'lodash/map';
import { mapGetters } from 'vuex';
import pluralize from 'pluralize';

const getDescriptor = (count, type) => `${count} ${pluralize(type, count)}`;
const arrayToSentence = arr => arr.join(', ').replace(/, ([^,]*)$/, ' and $1');

const getActivityInfo = (hasChanges, label) => hasChanges
  ? `${label} has unpublished content. `
  : `${label} content is published. `;

const getDescendantsInfo = (descendants, count, label) => {
  return `${descendants} within this ${label} ${pluralize('has', count)}
    unpublished content.`;
};

export default {
  props: {
    activity: { type: Object, default: () => ({}) }
  },
  computed: {
    ...mapGetters('repository', { outline: 'outlineActivities' }),
    activityInfo() {
      const { hasChanges, label } = this;
      return getActivityInfo(hasChanges, label);
    },
    descendantsInfo() {
      const { changedDescendants, label } = this;
      const labelCountMap = countBy(changedDescendants, getLabel);
      const descendants = arrayToSentence(map(labelCountMap, getDescriptor));
      return getDescendantsInfo(descendants, changedDescendants.length, label);
    },
    changedDescendants() {
      return filter(getDescendants(this.outline, this.activity), isChanged);
    },
    badgeColor() {
      return this.hasChanges || this.subtreeHasChanges ? 'orange' : 'green';
    },
    subtreeHasChanges() {
      return !!this.changedDescendants.length;
    },
    hasChanges() {
      return isChanged(this.activity);
    },
    label() {
      return getLabel(this.activity);
    }
  }
};
</script>

<style lang="scss" scoped>
::v-deep .v-badge {
  margin: 0 0.125rem;
}
</style>
