<template>
  <div id="app">
    <navbar></navbar>
    <div class="contaner-fluid">
      <router-view></router-view>
      <deletion-modal></deletion-modal>
    </div>
  </div>
</template>

<script>
import Navbar from './components/common/Navbar';
import DeletionModal from './components/common/deletionModal';

export default {
  name: 'app',
  components: {
    Navbar,
    DeletionModal
  }
};
</script>

<style lang="scss">
@import './assets/stylesheets/main';

html {
  width: 100%;
  height: 100%;
}

body {
  width: 100%;
  height: 100%;
  padding-top: 50px;
  background-color: #e0e0e0;
}

#app {
  width: 100%;
  height: 100%;
  color: rgba(0, 0, 0, .87);
  font-family: 'Catamaran', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}

.contaner-fluid {
  width: 100%;
  height: 100%;
}
</style>
