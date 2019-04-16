<template>
  <div class="inline-activator">
    <hr>
    <v-icon color="pink lighten-1" class="px-2">mdi-plus</v-icon>
    <hr>
  </div>
</template>

<style lang="scss" scoped>
.inline-activator {
  display: flex;
  align-items: center;
  width: 100%;
  margin: 0;
  padding: 0 50px;
  opacity: 0;
  transition: opacity 0.3s, padding 0.3s;
  cursor: pointer;

  hr {
    flex: 1;
    display: inline-flex;
    height: 1px;
    margin: 0 0 1px 0;
    background-color: #90a4ae;
  }

  .v-icon {
    border: 1px solid #b0bec5;
    border-radius: 4px;
  }

  &:hover {
    padding: 10px 0;
    opacity: 1;
    transition: opacity 0.3s 0.25s, padding 0.3s 0.1s;
  }
}
</style>
