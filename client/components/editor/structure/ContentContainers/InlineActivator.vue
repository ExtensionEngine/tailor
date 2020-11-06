<template functional>
  <button
    v-on="listeners"
    :class="{ disabled: props.disabled }"
    class="inline-activator">
    <hr>
    <v-chip
      color="blue-grey darken-4"
      label dark small
      class="pa-1">
      <v-icon>mdi-plus</v-icon>
    </v-chip>
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
.default {
  padding: 0 50px;
  opacity: 0;
}

.inline-activator {
  @extend .default;

  display: flex;
  align-items: center;
  width: 100%;
  margin: 0;
  transition: opacity 0.3s, padding 0.3s;

  &, .v-chip {
    cursor: pointer;
  }

  hr {
    flex: 1;
    display: inline-flex;
    height: 1px;
    margin: 0;
    background-color: #90a4ae;
  }

  .v-chip {
    margin: 0;
  }

  &:hover, &:focus {
    padding: 10px 0;
    opacity: 1;
    outline: none;
    transition: opacity 0.3s 0.25s, padding 0.3s 0.1s;
  }

  &.disabled, &.disabled:hover {
    @extend .default;

    pointer-events: none;
  }
}
</style>
