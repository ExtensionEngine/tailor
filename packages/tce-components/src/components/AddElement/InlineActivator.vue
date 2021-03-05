<template>
  <button
    v-on="$listeners"
    :class="{ disabled }"
    class="inline-activator">
    <hr>
    <v-avatar size="20" color="primary darken-4">
      <v-icon size="16" dark>mdi-plus</v-icon>
    </v-avatar>
    <hr>
  </button>
</template>

<script>
export default {
  name: 'inline-activator',
  inheritAttrs: false,
  props: {
    disabled: { type: Boolean, required: false }
  }
};
</script>

<style lang="scss" scoped>
.default-activator-state {
  padding: 0 3.125rem;
  opacity: 0;
}

.inline-activator {
  @extend .default-activator-state;

  display: flex;
  align-items: center;
  width: 100%;
  margin: 0;
  padding: 0 3.125rem;
  opacity: 0;
  transition: opacity 0.3s, padding 0.3s;

  &, .v-chip {
    cursor: pointer;
  }

  hr {
    flex: 1;
    display: inline-flex;
    margin: 0;
    border-top: 0.0625rem dashed var(--v-primary-darken3);
  }

  &:hover, &:focus {
    padding: 0.75rem 0;
    opacity: 1;
    outline: none;
    transition: opacity 0.3s 0.25s, padding 0.3s 0.1s;
  }

  &.disabled, &.disabled:hover {
    @extend .default-activator-state;

    pointer-events: none;
  }
}
</style>
