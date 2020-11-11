<template>
  <div class="auth-container">
    <v-sheet elevation="0" rounded class="auth-panel">
      <div class="auth-header py-8">
        <v-avatar size="80" color="blue-grey darken-4" class="pa-2">
          <img :src="logo" alt="Logo" class="logo">
        </v-avatar>
        <h1 class="ma-2 headline">{{ title }}</h1>
      </div>
      <div class="auth-body">
        <router-view />
      </div>
    </v-sheet>
    <div class="waves-container">
      <waves height="15rem" color="31,58,84" slow />
    </div>
  </div>
</template>

<script>
import Waves from '@/components/common/Waves';

export default {
  computed: {
    title: () => BRAND_CONFIG.TITLE,
    logo: () => BRAND_CONFIG.LOGO_FULL
  },
  components: { Waves }
};
</script>

<style lang="scss">
.auth-container {
  padding-top: 5%;
}

.auth-container .auth-panel.v-sheet {
  width: 26rem;
  margin: auto;
  background: #eee;
  border: 1px dashed #777;
  transition: all 0.2s cubic-bezier(0.25, 0.8, 0.25, 1);

  &:hover {
    background: #f4f4f4;
  }

  .auth-header {
    padding-bottom: 0;

    .logo {
      max-width: 3.5rem;
    }
  }

  .auth-body {
    padding: 0.25rem 1.5rem 2rem;

    a {
      color: inherit;
      font-weight: 400;
    }
  }
}

.auth-container .waves-container {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
}
</style>
