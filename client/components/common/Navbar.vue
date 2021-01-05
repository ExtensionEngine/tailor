<template>
  <v-app-bar
    color="blue-grey darken-3"
    app fixed dense
    class="elevation-0">
    <router-link :to="{ name: 'catalog' }" tag="a" class="app-brand">
      <img :src="logo" width="36px" height="36px" alt="Logo" class="pt-2">
      <v-toolbar-title class="app-name">
        {{ title }}
        <span class="caption">author</span>
      </v-toolbar-title>
    </router-link>
    <v-spacer />
    <v-toolbar-items>
      <v-btn
        v-for="({ name, to, icon }) in routes"
        :key="name"
        :to="to"
        color="blue-grey lighten-4"
        active-class="secondary--text"
        exact text>
        <v-icon v-if="icon" class="pr-1">mdi-{{ icon }}</v-icon>
        <span class="toolbar-route text-truncate">{{ name }}</span>
      </v-btn>
    </v-toolbar-items>
    <v-menu
      min-width="220px"
      transition="slide-y-transition"
      offset-y
      z-index="1000">
      <template v-slot:activator="{ on }">
        <v-btn v-on="on" icon class="mr-2">
          <v-avatar size="36" color="teal accent-4">
            <img :src="user.imgUrl">
          </v-avatar>
        </v-btn>
      </template>
      <v-list class="text-left">
        <v-list-item>
          <v-list-item-title>{{ user.email }}</v-list-item-title>
        </v-list-item>
        <v-list-item :to="{ name: 'user-settings' }">
          <v-list-item-title>Profile</v-list-item-title>
        </v-list-item>
        <v-list-item @click="logout">
          <v-list-item-title>Logout</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>
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
    ...mapGetters('repository', ['repository']),
    title: () => BRAND_CONFIG.TITLE,
    logo: () => BRAND_CONFIG.LOGO_FULL,
    routes() {
      const items = [
        { name: 'Catalog', to: { name: 'catalog' } },
        { name: 'Admin', to: { name: 'system-user-management' } }
      ];
      if (!this.isAdmin) items.pop();
      if (this.repository) {
        items.unshift({
          name: `${this.repository.name} structure`,
          to: { name: 'repository', params: { repositoryId: this.repository.id } }
        });
      }
      return items;
    }
  },
  methods: {
    ...mapActions({ apiLogout: 'logout' }),
    logout() {
      if (this.$oidc.active) return this.$oidc.logout();
      return this.apiLogout()
        .then(() => this.$router.push({ name: 'login' }));
    }
  }
};
</script>

<style lang="scss" scoped>
$container-height: 2.5rem;
$font-color: #333;

.v-toolbar {
  z-index: 10;

  .v-toolbar__content .v-btn.v-btn--icon {
    width: unset;
    height: unset;
  }
}

.v-toolbar__items {
  margin-right: 1rem;
}

.app-brand {
  display: flex;
  padding-bottom: 0.125rem;
  cursor: pointer;

  .app-name {
    margin: 0.125rem 0 0 0.375rem;
    color: #fafafa;
    font-size: 1.25rem;
    font-weight: 400;
    letter-spacing: 1px;
    line-height: $container-height;
    text-transform: uppercase;
  }
}

.toolbar-route {
  max-width: 12.5rem;
}

.v-avatar img {
  padding: 0.125rem;
}
</style>
