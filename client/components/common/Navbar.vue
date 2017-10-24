<template>
  <nav v-if="user" class="navbar navbar-default navbar-fixed-top">
    <div class="container-fluid">
      <div class="navbar-header">
        <router-link :to="{ name: 'catalog' }" class="navbar-brand">
          <img src="../../assets/img/logo-b.svg" alt="Logo"/>
          <span>CGMA Author</span>
        </router-link>
      </div>
      <router-link
        v-if="course"
        :to="{ name: 'course', params: { courseId: course.id }}"
        class="course-title">
        {{ course.name }}
      </router-link>
      <ul class="nav navbar-nav navbar-right">
        <li class="dropdown">
          <a href="#" class="dropdown-toggle" data-toggle="dropdown">
            Welcome {{ user.email }}
            <span class="fa fa-caret-down"></span>
          </a>
          <ul class="dropdown-menu">
            <li><a href="#" @click="logout">Log out</a></li>
          </ul>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
import { mapGetters, mapActions } from 'vuex-module';

export default {
  name: 'navbar',
  computed: {
    ...mapGetters(['user']),
    ...mapGetters(['course'], 'course')
  },
  methods: mapActions(['logout'])
};
</script>

<style lang="scss">
.navbar {
  background-color: white;

  .fa {
    padding: 0 5px;
  }

  .navbar-brand {
    width: 195px;
    padding: 10px 20px 0;

    img {
      float: left;
      width: 30px;
      margin-right: 15px;
    }

    span {
      display: inline-block;
      font-size: 18px;
      line-height: 32px;
    }
  }

  .course-title {
    float: left;
    width: 50%;
    color: #666;
    font-size: 15px;
    line-height: 50px;
    font-family: Roboto, 'Helvetica Neue', Helvetica, Arial, sans-serif;
    text-align: left;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-decoration: none;
    overflow: hidden;

    &:hover {
      color: #444;
    }

    @media (max-width: 1200px) {
      width: 40%;
    }

    @media (max-width: 1000px) {
      width: 25%;
    }
  }
}
</style>
