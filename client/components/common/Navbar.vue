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
        <router-link :to="{ name: 'catalog' }" class="navbar-brand">
          <img src="../../assets/img/logo.png" alt="Logo" />
        </router-link>
      </div>

      <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
        <div v-if="course" class="course-title">
          {{course.title}}
        </div>

        <ul class="nav navbar-nav navbar-right">
          <li v-if="!loggedIn"><router-link :to="{ name: 'login' }">Login</router-link></li>
          <li v-if="loggedIn"><a href="#">Logout</a></li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
  import { mapGetters } from 'vuex';

  export default {
    name: 'navbar',

    computed: {
      ...mapGetters({
        request: 'loginUserRequest',
        success: 'loginUserSuccess',
        course: 'getCourse'
      }),
      loggedIn() {
        return this.success && !this.request;
      }
    }
  };
</script>

<style lang="scss">
  .navbar {
    background-color: #f5f5f5;
    border-radius: 0;
    color: rgba(0, 0, 0, .87);
    font-weight: 500;
    margin: 0;
    z-index: 1000;

    .navbar-brand {
      color: inherit;
      padding: 10px 20px;
      width: 80px;
    }

    .navbar-right {
      > li > a {
        color: inherit;
      }
    }

    .course-title {
      display: inline-block;
      float: left;
      font-size: 22px;
      font-weight: 600;
      padding-top: 12px;
    }
  }
</style>
