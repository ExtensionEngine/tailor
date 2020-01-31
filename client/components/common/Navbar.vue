<template>
  <v-app-bar
    color="blue-grey darken-3"
    app dense fixed
    class="elevation-1">
    <router-link :to="{ name: 'catalog' }" tag="span" class="app-brand">
      <v-avatar color="primary lighten-1" size="34" class="mt-1 pa-2">
        <img :src="logo" alt="Logo">
      </v-avatar>
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
        exact text>
        <v-icon class="pr-1">mdi-{{ icon }}</v-icon>
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
          <v-avatar size="34" color="grey lighten-2">
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
          to: { name: 'repository', params: { repositoryId: this.repository.id } },
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
    margin: 0.125rem 0 0 0.625rem;
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
</style>
