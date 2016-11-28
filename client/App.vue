<template>
  <div id="app">
    <navbar></navbar>
    <div class="contaner-fluid">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
  import Navbar from './layout/Navbar';

  export default {
    name: 'app',
    components: {
      Navbar
    }
  };
</script>

<style lang="scss">
  @import './assets/stylesheets/main';

  #app {
    color: #2c3e50;
    font-family: 'Catamaran', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
  }
</style>
