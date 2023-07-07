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
  name: 'tailor-inline-activator',
  inheritAttrs: false,
  props: {
    disabled: { type: Boolean, required: false }
  }
};
</script>

<style lang="scss" scoped>
.default-activator-state {
  opacity: 0;
  padding: 0 3.125rem;
}

.inline-activator {
  @extend .default-activator-state;

  display: flex;
  opacity: 0;
  transition: opacity 0.3s, padding 0.3s;
  margin: 0;
  width: 100%;
  padding: 0 3.125rem;
  align-items: center;

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
    opacity: 1;
    transition: opacity 0.3s 0.25s, padding 0.3s 0.1s;
    padding: 0.75rem 0;
    outline: none;
  }

  &.disabled, &.disabled:hover {
    @extend .default-activator-state;

    pointer-events: none;
  }
}
</style>
