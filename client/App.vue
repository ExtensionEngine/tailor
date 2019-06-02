<template>
  <v-app id="app">
    <navbar v-if="user" :user="user"/>
    <v-content>
      <router-view class="view grey lighten-3"/>
    </v-content>
    <confirmation-modal/>
  </v-app>
</template>

<script>
import ConfirmationModal from 'components/common/ConfirmationModal';
import isIexplorer from 'is-iexplorer';
import { mapGetters } from 'vuex-module';
import Navbar from 'components/common/Navbar';

if (isIexplorer) document.body.classList.add('ie');

export default {
  name: 'app',
  computed: mapGetters(['user']),
  components: {
    ConfirmationModal,
    Navbar
  }
};
</script>

<style lang="scss">
@import '~@/assets/stylesheets/main';

html, body {
  width: 100%;
  height: 100%;
}

html {
  overflow-y: auto !important; // override Vuetify's default style
}

#app {
  color: rgba(0,0,0,0.87);
  font-family: Poppins, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  overflow: hidden;
}

.v-content .view {
  overflow-y: scroll;
  overflow-y: overlay;
}

.application, .v-content, .view {
  width: 100%;
  height: 100%;
}
</style>
