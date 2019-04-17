<template>
  <v-app id="app">
    <navbar v-if="user" :user="user"/>
    <v-content>
      <router-view class="view"/>
    </v-content>
    <confirmation-modal/>
  </v-app>
</template>

<script>
import ConfirmationModal from 'components/common/ConfirmationModal';
import isIexplorer from 'is-iexplorer';
import Navbar from 'components/common/Navbar';
import { mapGetters } from 'vuex-module';

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

#app {
  color: rgba(0,0,0,0.87);
  font-family: Roboto, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  overflow: hidden;
  background-color: #e0e0e0 !important;
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
