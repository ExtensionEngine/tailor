<template>
  <nav class="navbar navbar-default">
    <div class="container-fluid">
      <div class="navbar-header">
        <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
          <span class="sr-only">Toggle navigation</span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
        </button>
        <router-link :to="{ name: 'home' }" class="navbar-brand">Tailor</router-link>
      </div>

      <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
        <ul class="nav navbar-nav navbar-right">
          <li v-if="!loggedIn"><router-link :to="{ name: 'login' }">Login</router-link></li>
          <li v-if="loggedIn"><a href="#">Logout</a></li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
  export default {
    name: 'navbar',

    computed: {
      loggedIn() {
        const request = this.$store.state[0].request;
        const success = this.$store.state[0].success;

        return success && !request;
      }
    }
  };
</script>

<style lang="scss">
  .navbar {
    background-color: #fff;
    border-radius: 0;
    font-weight: 500;
  }
</style>
