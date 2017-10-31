<template>
  <nav v-if="user" class="navbar navbar-default navbar-fixed-top">
    <div class="container-fluid">
      <div class="navbar-header">
        <router-link :to="{ name: 'catalog' }" class="navbar-brand">
          <img :src="logo" alt="Logo"/>
          <span>{{ title }}</span>
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
            <span class="icon mdi mdi-menu-down"></span>
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
  data() {
    return {
      logo: LOGO_COMPACT,
      title: TITLE_FULL
    };
  },
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

  .dropdown-toggle .icon {
    padding: 0 5px;

    &::before {
      position: relative;
      top: -2px;
      font-size: 24px;
      line-height: 24px;
      vertical-align: middle;
    }
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
