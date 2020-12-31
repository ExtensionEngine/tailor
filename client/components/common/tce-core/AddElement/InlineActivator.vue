<template>
  <div class="inline-activator">
    <hr>
    <v-avatar color="teal accent-4" size="22">
      <v-icon dark>mdi-plus</v-icon>
    </v-avatar>
    <hr>
  </div>
</template>

<style lang="scss" scoped>
.inline-activator {
  display: flex;
  align-items: center;
  width: 100%;
  margin: 0;
  padding: 0 3.125rem;
  opacity: 0;
  transition: opacity 0.3s, padding 0.3s;
  cursor: pointer;

  hr {
    flex: 1;
    display: inline-flex;
    margin: 0;
    border-top: 0.0625rem dashed #1de9b6;
  }

  &:hover {
    padding: 0.75rem 0;
    opacity: 1;
    transition: opacity 0.3s 0.25s, padding 0.3s 0.1s;
  }
}
</style>
