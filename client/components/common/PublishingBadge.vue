<template>
  <v-tooltip v-bind="tooltipConfig">
    <template v-slot:activator="{ on }">
      <span v-on="on">
        <v-badge v-bind="badgeConfig" />
      </span>
    </template>
    <slot></slot>
  </v-tooltip>
</template>

<script>
const BADGE_DEFAULTS = { dot: true, inline: true };
const TOOLTIP_DEFAULTS = { openDelay: 800 };

export default {
  props: {
    tooltip: { type: Object, default: () => ({}) }
  },
  computed: {
    badgeConfig: vm => ({ ...BADGE_DEFAULTS, ...vm.$attrs }),
    tooltipConfig: vm => ({ ...TOOLTIP_DEFAULTS, ...vm.tooltip })
  }
};
</script>

<style lang="scss" scoped>
::v-deep .v-badge {
  margin: 0 0.125rem;
}
</style>
