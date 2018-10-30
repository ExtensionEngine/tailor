<template>
  <nav v-if="user" class="navbar navbar-default navbar-fixed-top">
    <div class="container-fluid">
      <div class="navbar-header">
        <router-link :to="{ name: 'catalog' }" class="navbar-brand">
          <img :src="logo" alt="Logo" class="logo"/>
          <div class="title">{{ title }}</div>
        </router-link>
      </div>
      <router-link
        v-if="course"
        :to="{ name: 'course', params: { courseId: course.id } }"
        class="course-title">
        <span class="navbar-acronym">
          <span>{{ courseAcronym }}</span>
        </span>
        {{ course.name }}
      </router-link>
      <ul class="nav navbar-nav navbar-right">
        <li class="dropdown">
          <a href="#" class="dropdown-toggle" data-toggle="dropdown">
            Welcome {{ user.email }}
            <span class="icon mdi mdi-menu-down"></span>
          </a>
          <ul class="dropdown-menu">
            <li v-if="isAdmin">
              <router-link :to="{ name: 'system-user-management' }">
                System user management
              </router-link>
            </li>
            <li><a @click="logout" href="#">Log out</a></li>
          </ul>
        </li>
      </ul>
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
    ...mapGetters(['user', 'isAdmin']),
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

    .logo {
      float: left;
      height: 36px;
      margin: 12px 25px 0 20px;
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
    width: 50%;
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

    &:hover {
      color: darken($font-color, 20%);
    }

    @media (max-width: 1200px) {
      width: 40%;
    }

    @media (max-width: 1000px) {
      width: 25%;
    }
  }

  .navbar-acronym {
    padding-right: 4px;
    color: #777;
    font-weight: bold;
  }

  .navbar-nav {
    .dropdown a {
      padding: 20px 10px;
      color: $font-color;
    }

    .dropdown-menu a {
      padding: 12px 15px;
    }

    ul {
      border-radius: 2px;
    }
  }
}
</style>
