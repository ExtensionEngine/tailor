<template>
  <v-app id="app">
    <navbar v-if="user" :user="user" />
    <v-main>
      <router-view class="view" />
    </v-main>
    <confirmation-modal />
  </v-app>
</template>

<script>
import ConfirmationModal from 'components/common/ConfirmationModal.vue';
import isIexplorer from 'is-iexplorer';
import { mapState } from 'vuex';
import Navbar from 'components/common/Navbar.vue';

if (isIexplorer) document.body.classList.add('ie');

export default {
  name: 'app',
  computed: mapState({
    user: state => state.auth.user
  }),
  components: {
    ConfirmationModal,
    Navbar
  }
};
</script>

<style lang="scss">
@import '@/assets/stylesheets/main';

html, body {
  width: 100%;
  height: 100%;
}

html {
  overflow-y: auto !important; // override Vuetify's default style
}

#app {
  --text-color-default: rgb(0 0 0 / 87%);

  overflow: hidden;
  height: 100vh;
  font-family: $font-family-primary;
  text-align: center;
  color: var(--text-color-default);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.application, .v-application--wrap, .v-main, .view {
  width: 100%;
  height: 100%;
}

.v-main {
  background-color: $bg-color-default;
}

.v-main .view {
  overflow-y: scroll;
  overflow-y: overlay;
}

.text--default {
  color: var(--text-color-default);
}
</style>
