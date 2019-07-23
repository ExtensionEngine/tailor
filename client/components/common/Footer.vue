<template>
  <v-footer height="46" color="primary" absolute>
    <v-layout row justify-center>
      <v-flex
        xs-12
        class="body-2 grey--text text--lighten-4 py-2">
        <v-chip
          color="grey lighten-4"
          label
          small
          class="mr-3 grey--text text--darken-4">
          v3.1 Silk
        </v-chip>
        Built with <v-icon color="pink">mdi-heart</v-icon>
        Extension Engine
      </v-flex>
    </v-layout>
  </v-footer>
</template>

<style lang="scss" scoped>
.v-footer {
  box-shadow: 0px -1px 1px 0px rgba(0,0,0,0.2);
}
</style>
