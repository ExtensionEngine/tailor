<template>
  <v-footer height="46" color="primary darken-4" absolute>
    <div class="d-flex flex-grow-1 align-center justify-center text-body-2 grey--text text--lighten-4">
      <img :src="logo" width="30px" height="30px" alt="Logo" class="py-1 mx-1">
      <v-chip
        color="grey lighten-4"
        label small
        class="readonly mr-3 grey--text text--darken-4">
        v{{ version }} {{ codename }}
      </v-chip>
      Built with <v-icon class="mx-1" color="pink">mdi-heart</v-icon>
      Extension Engine
    </div>
  </v-footer>
</template>

<script>
import { codename, version } from '@/../package.json';
import { brandConfig } from 'brand-config';

const capitalize = str => str.charAt(0).toUpperCase() + str.substr(1);

export default {
  name: 'app-footer',
  computed: {
    version: () => version,
    codename: () => capitalize(codename),
    logo: () => brandConfig.logo.compact
  }
};
</script>

<style lang="scss" scoped>
.v-footer {
  box-shadow: 0 -1px 1px 0 rgba(0,0,0,0.2);
}
</style>
