<template>
  <div class="inline-activator">
    <hr>
    <v-icon class="activator" color="blue-grey darken-2">mdi-plus</v-icon>
    <hr>
  </div>
</template>

<style lang="scss" scoped>
.inline-activator {
  display: flex;
  align-items: center;
  width: 100%;
  margin: 0;
  opacity: 0;
  transition: opacity 0.5s;
  cursor: pointer;

  hr {
    flex: 1;
    display: inline-flex;
    height: 2px;
    margin: 0 0 1px 0;
    background-color: #717171;
    transition: height 0.2s;
  }

  .activator {
    transition: font-size 0.2s;
  }

  &:hover {
    $delay: 0.2s;
    opacity: 1;

    &, hr, .activator {
      transition-delay: $delay;
    }

    hr {
      height: 3px;
    }

    .activator {
      font-size: 40px;
    }
  }
}
</style>
