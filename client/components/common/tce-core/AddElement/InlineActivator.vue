<template>
  <div class="inline-activator">
    <hr>
    <v-icon color="blue-grey darken-2">mdi-plus</v-icon>
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
  transition: opacity 0.5s ease-in-out;
  cursor: pointer;

  hr {
    flex: 1;
    display: inline-flex;
    height: 2px;
    margin: 0;
    background-color: #717171;
  }

  &:hover {
    opacity: 1;
  }
}
</style>
