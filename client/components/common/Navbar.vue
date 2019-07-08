<template>
  <v-toolbar color="white" app fixed>
    <router-link :to="{ name: 'catalog' }" tag="span" class="app-brand">
      <v-avatar color="blue darken-3" size="40">
        <v-icon color="white">mdi-content-cut</v-icon>
      </v-avatar>
      <v-toolbar-title class="app-name">{{ title }}</v-toolbar-title>
    </router-link>
    <v-spacer/>
    <router-link
      v-if="repository"
      :to="{ name: 'course', params: { courseId: repository.id }}"
      class="repository-title">
      <span class="navbar-acronym">
        <span>{{ repositoryAcronym }}</span>
      </span>
      {{ repository.name }}
    </router-link>
    <v-toolbar-items>
      <v-btn :to="{ name: 'catalog' }" exact flat icon>
        <v-icon>mdi-home</v-icon>
      </v-btn>
    </v-toolbar-items>
    <v-menu
      min-width="220px"
      transition="slide-y-transition"
      offset-y
      z-index="1000">
      <v-btn slot="activator" icon large class="mr-2">
        <v-avatar size="42px" color="#eaeaea">
          <span class="grey--text headline">{{ user.email[0] }}</span>
        </v-avatar>
      </v-btn>
      <v-list>
        <v-list-tile>
          <v-list-tile-title>{{ user.email }}</v-list-tile-title>
        </v-list-tile>
        <v-list-tile v-if="isAdmin" :to="{ name: 'system-management' }">
          <v-list-tile-title>System Settings</v-list-tile-title>
        </v-list-tile>
        <v-list-tile @click="logout">
          <v-list-tile-title>Logout</v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-menu>
  </v-toolbar>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { getAcronym } from 'utils/course';

export default {
  name: 'main-toolbar',
  props: {
    user: { type: Object, required: true }
  },
  data() {
    return {
      title: BRAND_CONFIG.TITLE
    };
  },
  computed: {
    ...mapGetters(['isAdmin']),
    ...mapGetters('course', { repository: 'course' }),
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

.v-toolbar {
  z-index: 10;
}

.v-toolbar__items {
  margin-right: 15px;
}

.app-brand {
  display: flex;
  cursor: pointer;

  .app-name {
    font-size: 20px;
    font-weight: 400;
    line-height: $container-height;
  }
}

.repository-title {
  max-width: 250px;
  margin-right: 15px;
  color: $font-color;
  font-size: 16px;
  line-height: $container-height;
  text-align: left;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-decoration: none;
  overflow: hidden;

  &:hover {
    color: darken($font-color, 20%);
  }
}

.navbar-acronym {
  padding-right: 4px;
  color: #777;
  font-weight: bold;
}
</style>
