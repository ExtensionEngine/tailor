<template>
  <nav class="navbar navbar-default navbar-fixed-top">
    <div class="container-fluid">
      <div class="navbar-header">
        <router-link :to="{ name: 'catalog' }" class="navbar-brand">
          <img src="../../assets/img/logo.png" alt="Logo" />
          <span>CGMA Author</span>
        </router-link>
      </div>
      <div v-if="course" class="course-title">{{course.title}}</div>
      <ul class="nav navbar-nav navbar-right">
        <li v-if="loggedIn"><a href="#">Logout</a></li>
      </ul>
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
  color: #555;
  font-weight: 500;
  background-color: white;

  .navbar-brand {
    width: 250px;
    padding: 9px 15px;

    img {
      float: left;
      width: 72px;
    }

    span {
      display: inline-block;
      line-height: 32px;
      font-size: 18px;
    }
  }

  .course-title {
    float: left;
    padding-left: 10px;
    font-size: 15px;
    line-height: 50px;
  }
}
</style>
