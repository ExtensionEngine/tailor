<template>
  <div class="inline-activator">
    <hr>
    <v-chip color="blue-grey" label dark small>
      <v-icon>mdi-plus</v-icon>
    </v-chip>
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
    margin: 0;
    background-color: #90a4ae;
  }

  .v-chip {
    margin: 0;
  }

  &:hover {
    padding: 10px 0;
    opacity: 1;
    transition: opacity 0.3s 0.25s, padding 0.3s 0.1s;
  }
}
</style>
