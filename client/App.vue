<template>
  <div id="app">
    <navbar></navbar>
    <router-view class="contaner-fluid view"></router-view>
    <confirmation-modal></confirmation-modal>
  </div>
</template>

<script>
import ConfirmationModal from 'components/common/ConfirmationModal';
import Navbar from 'components/common/Navbar';

export default {
  name: 'app',
  components: {
    ConfirmationModal,
    Navbar
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
  background-color: #e0e0e0;
}

#app {
  height: 100%;
  padding-top: 55px;
  color: rgba(0,0,0,0.87);
  font-family: 'Catamaran', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  overflow: hidden;
}

// TODO: Remove global override of Bootstrap class
.contaner-fluid {
  height: 100%;
}
</style>
