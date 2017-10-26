<template>
  <div id="app">
    <navbar></navbar>
    <router-view class="contaner-fluid view"></router-view>
    <confirmation-modal></confirmation-modal>
  </div>
</template>

<script>
import Navbar from './components/common/Navbar';
import ConfirmationModal from './components/common/ConfirmationModal';

export default {
  name: 'app',
  components: {
    Navbar,
    ConfirmationModal
  }
};
</script>

<style lang="scss">
@import './assets/stylesheets/main';

html, body {
  width: 100%;
  height: 100%;
}

body {
  padding-top: 50px;
  background-color: #e0e0e0;
}

#app {
  height: 100%;
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
