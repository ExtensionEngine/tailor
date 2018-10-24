<template>
  <nav v-if="user" class="navbar navbar-default navbar-fixed-top">
    <div class="container-fluid">
      <div class="row">
        <div class="navbar-header col-xs-8 col-sm-7 col-md-7">
          <router-link :to="{ name: 'catalog' }" class="navbar-brand">
            <img :src="logo" alt="Logo" class="logo"/>
            <div class="title hidden-xs">{{ title }}</div>
          </router-link>
          <router-link
            v-if="course"
            :to="{ name: 'course', params: { courseId: course.id }}"
            class="course-title">
            <span class="navbar-acronym">
              <span>{{ courseAcronym }}</span>
            </span>
            {{ course.name }}
          </router-link>
        </div>
        <div class="col-xs-4 col-sm-5 col-md-5">
          <ul class="nav navbar-nav navbar-right">
            <li class="dropdown">
              <a href="#" class="dropdown-toggle" data-toggle="dropdown">
                Welcome <span class="hidden-xs">{{ user.email }}</span>
                <span class="icon mdi mdi-menu-down"></span>
              </a>
              <ul class="dropdown-menu">
                <li><a @click="logout" href="#">Log out</a></li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import { getAcronym } from 'utils/course';
import { mapActions, mapGetters } from 'vuex-module';

export default {
  name: 'navbar',
  data() {
    return {
      logo: BRAND_CONFIG.LOGO_COMPACT,
      title: BRAND_CONFIG.TITLE
    };
  },
  computed: {
    ...mapGetters(['user']),
    ...mapGetters(['course'], 'course'),
    courseAcronym() {
      return this.course ? getAcronym(this.course.name) : null;
    }
  },
  methods: mapActions(['logout'])
};
</script>

<style lang="scss">
$nav-height: 64px;
$font-color: #424242;
$bg-color: #fff;

.navbar {
  height: $nav-height;
  background-color: $bg-color;
  box-shadow:
    0 2px 2px 0 rgba(0,0,0,0.14),
    0 1px 5px 0 rgba(0,0,0,0.12),
    0 3px 1px -2px rgba(0,0,0,0.2);

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
    height: $nav-height;
    padding: 0;
    max-width: 30%;

    .logo {
      float: left;
      height: 36px;
      margin: 12px 25px 0 20px;

      @media only screen and (max-width: 767px) {
        margin: 12px 10px 0;
      }
    }

    .title {
      float: left;
      color: $font-color;
      font-size: 18px;
      line-height: $nav-height;
    }

  }

  .course-title {
    float: left;
    width: 60%;
    margin-left: 38px;
    color: $font-color;
    font-size: 16px;
    line-height: $nav-height;
    font-family: Roboto, 'Helvetica Neue', Helvetica, Arial, sans-serif;
    text-align: left;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-decoration: none;
    overflow: hidden;

    @media only screen and (max-width: 767px) {
      margin-left: 10px;
      font-size: 12px;
    }

    &:hover {
      color: darken($font-color, 20%);
    }

  }

  .navbar-acronym {
    padding-right: 4px;
    color: #777;
    font-weight: bold;
  }

  .navbar-nav {

    @media only screen and (max-width: 767px) {
      margin: 0;
      font-size: 12px;
    }

    .dropdown .dropdown-menu {
      background-color: $bg-color;
      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
      margin: 0;
      padding: 0;

      @media only screen and (min-width: 320px) {
        float: right;
        &:hover {
          background-color: #f5f5f5;
        }
      }
    }

    .dropdown a {
      color: $font-color;
    }

    .dropdown a.dropdown-toggle {
      line-height: $nav-height;
      margin: 0;
      padding: 0 0 0 15px;
      text-align: right;
    }

    .dropdown-menu > li > a {
      @media only screen and (min-width: 320px) {
        line-height: initial;
        padding: 12px 15px;
      }
    }

    ul {
      border-radius: 2px;
    }
  }

  .navbar-right {
    margin-left: -15px;
    margin-right: -15px;
  }

}
</style>
