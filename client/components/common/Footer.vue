<template>
  <v-footer height="46" color="blue-grey darken-4" absolute>
    <waves class="waves" />
    <v-row justify="center" no-gutters>
      <v-col
        cols="12"
        class="body-2 grey--text text--lighten-4">
        <tailor-chip
          color="grey lighten-4"
          label
          small
          class="mr-3 grey--text text--darken-4">
          v{{ version }} {{ codename }}
        </tailor-chip>
        Built with <v-icon color="pink">mdi-heart</v-icon>
        Extension Engine
      </v-col>
    </v-row>
  </v-footer>
</template>

<script>
import { codename, version } from '@/../package.json';
import TailorChip from '@/components/common/TailorChip';
import Waves from '@/components/common/Waves';

const capitalize = str => str.charAt(0).toUpperCase() + str.substr(1);

export default {
  name: 'app-footer',
  computed: {
    version: () => version,
    codename: () => capitalize(codename)
  },
  components: { Waves, TailorChip }
};
</script>

<style lang="scss" scoped>
.v-footer {
  box-shadow: 0 -1px 1px 0 rgba(0,0,0,0.2);
}

.waves {
  position: absolute;
  left: 0;
  width: 100%;
}
</style>
