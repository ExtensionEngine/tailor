<template>
  <v-toolbar color="white" app fixed>
    <router-link :to="{ name: 'catalog' }" tag="span" class="app-brand">
      <v-avatar size="40">
        <img :src="logo" alt="Logo" class="logo"/>
      </v-avatar>
      <v-toolbar-title class="app-name">{{ title }}</v-toolbar-title>
    </router-link>
    <router-link
      v-if="repository"
      :to="{ name: 'course', params: { courseId: repository.id }}"
      class="repository-title">
      <span class="navbar-acronym">
        <span>{{ repositoryAcronym }}</span>
      </span>
      {{ repository.name }}
    </router-link>
    <v-spacer></v-spacer>
    <v-menu min-width="220px" transition="slide-y-transition" offset-y>
      <v-btn slot="activator" icon large class="mr-2">
        <v-avatar size="42px" color="#eaeaea">
          <span class="grey--text headline">{{ user.email[0] }}</span>
        </v-avatar>
      </v-btn>
      <v-list>
        <v-list-tile>
          <v-list-tile-title>{{ user.email }}</v-list-tile-title>
        </v-list-tile>
        <v-list-tile @click="logout">
          <v-list-tile-title>Logout</v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-menu>
  </v-toolbar>
</template>

<script>
import { mapActions, mapGetters } from 'vuex-module';
import { getAcronym } from 'utils/course';

export default {
  name: 'main-toolbar',
  data() {
    return {
      logo: BRAND_CONFIG.LOGO_COMPACT,
      title: BRAND_CONFIG.TITLE
    };
  },
  computed: {
    ...mapGetters(['user']),
    ...mapGetters({ repository: 'course' }, 'course'),
    repositoryAcronym() {
      return this.repository ? getAcronym(this.repository.name) : null;
    }
  },
  methods: mapActions(['logout'])
};
</script>

<style lang="scss" scoped>
$container-height: 40px;
$font-color: #333;

.app-brand {
  cursor: pointer;

  .v-avatar {
    float: left;
    margin-right: 14px;
  }

  .app-name {
    line-height: $container-height;
    font-size: 20px;
    font-weight: 400;
  }
}

.repository-title {
  float: left;
  width: 50%;
  margin-left: 30px;
  color: $font-color;
  font-size: 16px;
  line-height: $container-height;
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
</style>
