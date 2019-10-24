<template>
  <v-toolbar color="grey lighten-5" app dense fixed>
    <router-link :to="{ name: 'catalog' }" tag="span" class="app-brand">
      <v-avatar color="primary darken-1" size="34" class="mt-1">
        <img :src="logo" alt="Logo" class="logo">
      </v-avatar>
      <v-toolbar-title class="app-name">{{ title }}</v-toolbar-title>
    </router-link>
    <v-spacer />
    <v-toolbar-items>
      <v-btn
        v-for="({ name, to, icon }) in routes"
        :key="name"
        :to="to"
        color="blue-grey darken-3"
        exact
        flat>
        <v-icon class="pr-1">mdi-{{ icon }}</v-icon>
        <span class="toolbar-route">{{ name }}</span>
      </v-btn>
    </v-toolbar-items>
    <v-menu
      min-width="220px"
      transition="slide-y-transition"
      offset-y
      z-index="1000">
      <v-btn slot="activator" icon class="mr-2">
        <v-avatar size="34" color="grey lighten-2">
          <span class="grey--text text--darken-1 headline">{{ user.email[0] }}</span>
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
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'main-toolbar',
  props: {
    user: { type: Object, required: true }
  },
  computed: {
    ...mapGetters(['isAdmin']),
    ...mapGetters('course', { repository: 'course' }),
    title: () => BRAND_CONFIG.TITLE,
    logo: () => BRAND_CONFIG.LOGO_COMPACT,
    routes() {
      const items = [
        { name: 'Catalog', to: { name: 'catalog' }, icon: 'view-list' },
        { name: 'Admin', to: { name: 'system-user-management' }, icon: 'settings' }
      ];
      if (!this.isAdmin) items.pop();
      if (this.repository) {
        items.unshift({
          name: this.repository.name,
          to: { name: 'course', params: { courseId: this.repository.id } },
          icon: 'card-text-outline'
        });
      }
      return items;
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
  padding-bottom: 2px;
  cursor: pointer;

  .app-name {
    margin: 1px 0 0 10px;
    font-size: 20px;
    font-weight: 400;
    line-height: $container-height;
  }
}

.toolbar-route {
  max-width: 380px;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-decoration: none;
  overflow: hidden;

  &:hover {
    color: darken($font-color, 20%);
  }
}

.logo {
  width: 26px;
}
</style>
