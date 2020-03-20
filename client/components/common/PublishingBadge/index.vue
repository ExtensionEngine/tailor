<template>
  <v-tooltip v-bind="tooltipConfig">
    <template v-slot:activator="{ on }">
      <span v-on="on">
        <v-badge :color="color" inline dot />
      </span>
    </template>
    <publishing-info v-bind="activity" :has-changes="hasChanges" />
  </v-tooltip>
</template>

<script>
import PublishingInfo from './PublishingInfo';

const TOOLTIP_DEFAULTS = { openDelay: 800, maxWidth: 300 };

export default {
  props: {
    hasChanges: { type: Boolean, required: true },
    activity: { type: Object, default: () => ({}) }
  },
  computed: {
    color: vm => vm.hasChanges ? 'orange' : 'green',
    direction: vm => vm.activity.id ? 'left' : 'top',
    tooltipConfig: vm => ({ ...TOOLTIP_DEFAULTS, [vm.direction]: true })
  },
  components: { PublishingInfo }
};
</script>

<style lang="scss" scoped>
::v-deep .v-badge {
  margin: 0 0.125rem;
}
</style>
