<template>
  <v-app id="app">
    <navbar></navbar>
    <router-view class="contaner-fluid view"></router-view>
    <confirmation-modal></confirmation-modal>
  </v-app>
</template>

<script>
import ConfirmationModal from 'components/common/ConfirmationModal';
import isIexplorer from 'is-iexplorer';
import Navbar from 'components/common/Navbar';

if (isIexplorer) document.body.classList.add('ie');

export default {
  name: 'app',
  components: {
    ConfirmationModal,
    Navbar
  }
};
</script>

<style lang="scss">
@import '~assets/stylesheets/main';

html, body {
  width: 100%;
  height: 100%;
}

.application {
  background-color: #e0e0e0 !important;
}

#app {
  height: 100%;
  padding-top: 64px;
  color: rgba(0,0,0,0.87);
  font-family: 'Catamaran', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  overflow: hidden;

  > .view {
    overflow-y: scroll;
    overflow-y: overlay;
  }
}

// TODO: Remove global override of Bootstrap class
.contaner-fluid {
  height: 100%;
}
</style>
